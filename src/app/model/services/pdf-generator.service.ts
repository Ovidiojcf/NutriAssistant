import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { NRS1Form, NRS2Form, ASGForm } from '../interfaces/nutrition-form.interfaces';
import Paciente from '../entities/Paciente';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { Content, TDocumentDefinitions, Table } from 'pdfmake/interfaces';

type CustomTableLayout = {
  hLineWidth?: (i: number, node: any) => number;
  vLineWidth?: (i: number, node: any) => number;
  hLineColor?: (i: number, node: any) => string;
  paddingTop?: (i: number) => number;
  paddingBottom?: (i: number) => number;
};

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {

  private nrs1OptionsMap = {
    'pIMC': '1. O IMC do paciente é < 20,5 kg/m²?',
    'pPerda': '2. O paciente teve perda de peso não-intencional nos últimos três meses?',
    'pReducao': '3. O paciente teve redução na ingestão alimentar na última semana?',
    'pEstado': '4. O paciente está em estado grave, mau estado geral ou em terapia intensiva?'
  };

  private nrs2OptionsMap = {
    'eNutricionalPrejudicado': {
      'ausente': 'Ausente: Estado nutricional normal',
      'leve': 'Leve: Perda de peso > 5% em 3 meses OU ingestão alimentar abaixo de 50-75%',
      'moderado': 'Moderado: Perda de peso > 5% em 2 meses ou IMC 18,5-20,5 kg/m² + condições gerais prejudicadas',
      'grave': 'Grave: Perda de peso > 5% em 1 mês (>15% em 3 meses) ou IMC < 18,5 kg/m²'
    },
    'gravidadeDoenca': {
      'ausente': 'Ausente: Estado nutricional normal',
      'leve': 'Leve: Fratura de quadril, pacientes crônicos (cirrose, DPOC, diabetes, câncer)',
      'moderado': 'Moderado: Cirurgia abdominal maior, pneumonia grave, leucemias',
      'grave': 'Grave: Traumatismo craniano, transplante de medula, paciente em UTI'
    }
  };

  constructor(
    private storage: AngularFireStorage,
  ) {
    (pdfMake as any).vfs = (pdfFonts as any).vfs;
  }

  generatePdf(
    paciente: Paciente,
    formNRS1: NRS1Form,
    formNRS2: NRS2Form | null,
    formASG: ASGForm,
    pontuacaoASG: number,
    classificacaoASG: string,
    estadoNutricional: string,
  ): void {
    const docDefinition = this.buildDocDefinition(
      paciente, formNRS1, formNRS2, formASG, pontuacaoASG, classificacaoASG, estadoNutricional
    );
    pdfMake.createPdf(docDefinition).open();
  }

  private buildDocDefinition(
    paciente: Paciente,
    formNRS1: NRS1Form,
    formNRS2: NRS2Form | null,
    formASG: ASGForm,
    pontuacaoASG: number,
    classificacaoASG: string,
    estadoNutricional: string
  ): TDocumentDefinitions {
    const content: Content[] = [
      this.createHeader(),
      this.createPatientSection(paciente, formNRS1, formASG),
      this.createNRS1Section(formNRS1),
      ...(formNRS2 ? [this.createNRS2Section(formNRS2)] : []),
      this.createASGSection(formASG),
      this.createResultsSection(pontuacaoASG, classificacaoASG, estadoNutricional),
      this.createObservationsSection(formASG.evolucaoNutricional)
    ];

    return {
      content: content,
      styles: {
        documentTitle: {
          fontSize: 18,
          bold: true,
          alignment: 'center',
          color: '#2e7d32',
          margin: [0, 0, 0, 20]
        },
        sectionTitle: {
          fontSize: 14,
          bold: true,
          color: '#1b5e20',
          margin: [0, 15, 0, 8]
        },
        subsectionTitle: {
          fontSize: 12,
          bold: true,
          color: '#1b5e20',
          margin: [0, 5, 0, 5],
          decoration: 'underline'
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: '#333333'
        },
        questionText: {
          fontSize: 11,
          lineHeight: 1.2
        },
        valueText: {
          fontSize: 11
        }
      },
      defaultStyle: {
        fontSize: 11,
        lineHeight: 1.4
      }
    };
  }

  private createHeader(): Content {
    return {
      text: 'FICHA NUTRICIONAL',
      style: 'documentTitle',
      margin: [0, 0, 0, 20]
    };
  }

  private createPatientSection(paciente: Paciente, formNRS1: NRS1Form, formASG: ASGForm): Content {
    return {
      stack: [
        { text: 'DADOS DO PACIENTE', style: 'sectionTitle' },
        {
          table: {
            widths: ['40%', '60%'],
            body: [
              ['Nome Completo', paciente.nome || 'Não informado'],
              ['Idade', paciente.idade?.toString() || 'Não informado'],
              ['Data da Avaliação', formNRS1.data || 'Não informado'],
              ['Alergias', this.formatArrayValue(paciente.alergias)],
              ['Comorbidades', paciente.comorbidades || 'Não informado'],
              ['IMC', formASG.imc || 'Não calculado']
            ]
          },
          layout: this.getTableLayout()
        }
      ]
    };
  }

  private createNRS1Section(formData: NRS1Form): Content {
    // Especifica que as chaves são do tipo keyof NRS1Form
    const orderedKeys: Array<keyof NRS1Form> = ['pIMC', 'pPerda', 'pReducao', 'pEstado'];

    return {
      stack: [
        { text: 'PARTE 1 - NRS (Rastreamento Nutricional)', style: 'sectionTitle' },
        {
          table: {
            widths: ['60%', '40%'],
            body: orderedKeys.map(key => [
              { text: this.formatLabel(key, 'nrs1'), style: 'questionText' },
              { text: this.formatValue(formData[key]) } // Agora TypeScript sabe que 'key' é válido
            ])
          },
          layout: this.getTableLayout()
        }
      ]
    };
  }

  private createNRS2Section(formData: NRS2Form): Content {
    return {
      stack: [
        { text: 'PARTE 2 - NRS (Avaliação Nutricional)', style: 'sectionTitle' },
        {
          table: {
            widths: ['60%', '40%'],
            body: [
              ['A. Estado nutricional prejudicado',
               this.nrs2OptionsMap.eNutricionalPrejudicado[formData.eNutricionalPrejudicado || 'ausente']],
              ['B. Gravidade da doença',
               this.nrs2OptionsMap.gravidadeDoenca[formData.gravidadeDoenca || 'ausente']]
            ]
          },
          layout: this.getTableLayout()
        }
      ]
    };
  }

  private createASGSection(formData: ASGForm): Content {
    const sections: Content[] = [];

    // Seção Peso
    sections.push({
      table: {
        widths: ['60%', '40%'],
        body: [
          ['Peso Atual (kg)', this.formatValue(formData.pesoAtual)],
          ['Peso Habitual (kg)', this.formatValue(formData.pesoHabitual)],
          ['Perda de Peso (%)', this.formatValue(formData.perdaPeso)],
          ['Mudança de Peso', this.formatValue(formData.mudancaPeso)],
          ['Continua Perdendo Peso', this.formatValue(formData.continuaPerdendoPeso)]
        ]
      },
      layout: this.getTableLayout()
    });

    // Seção Dieta
    const dietaRows = [
      ['Mudança na Dieta', this.formatValue(formData.mudancaDieta)],
      ...(formData.mudancaDieta === 'sim' ? [
        ['- Dieta Hipocalórica', this.formatValue(formData.dietaHipocalorica)],
        ['- Dieta Pastosa Hipocalórica', this.formatValue(formData.dietaPastosaHipocalorica)],
        ['- Dieta Líquida', this.formatValue(formData.dietaLiquida)],
        ['- Jejum > 5 dias', this.formatValue(formData.jejum)],
        ['- Mudança Persistente > 30 dias', this.formatValue(formData.mudancaPersistente)]
      ] : [])
    ];

    sections.push({
      stack: [
        { text: 'DIETA', style: 'subsectionTitle' },
        {
          table: {
            widths: ['60%', '40%'],
            body: dietaRows
          },
          layout: this.getTableLayout()
        }
      ],
      margin: [0, 10, 0, 0]
    });

    // Seção Sintomas
    const sintomasAtivos = [
      formData.disfagia && 'Disfagia',
      formData.nauseas && 'Náuseas',
      formData.vomitos && 'Vômitos',
      formData.diarreia && 'Diarreia',
      formData.anorexia && 'Anorexia'
    ].filter(Boolean);

    if (sintomasAtivos.length) {
      sections.push({
        text: 'Sintomas Gastrointestinais: ' + sintomasAtivos.join(', '),
        margin: [0, 10, 0, 0]
      });
    }

    // Seção Capacidade Funcional
    sections.push({
      table: {
        widths: ['60%', '40%'],
        body: [
          ['Capacidade Funcional', this.formatValue(formData.capacidadeFuncional)]
        ]
      },
      layout: this.getTableLayout(),
      margin: [0, 10, 0, 0]
    });

    // Seção Diagnóstico
    sections.push({
      table: {
        widths: ['60%', '40%'],
        body: [
          ['Diagnóstico', this.formatValue(formData.diagnostico)]
        ]
      },
      layout: this.getTableLayout(),
      margin: [0, 10, 0, 0]
    });

    // Seção Exame Físico
    sections.push({
      table: {
        widths: ['60%', '40%'],
        body: [
          ['Perda de Gordura Subcutânea', this.formatValue(formData.perdaGordura)],
          ['Perda de Músculo Estriado', this.formatValue(formData.perdaMusculo)],
          ['Edema Sacral', this.formatValue(formData.edemaSacral)],
          ['Edema de Tornozelo', this.formatValue(formData.edemaTornozelo)],
          ['Ascite', this.formatValue(formData.ascite)]
        ]
      },
      layout: this.getTableLayout(),
      margin: [0, 10, 0, 0]
    });

    return {
      stack: [
        { text: 'AVALIAÇÃO SUBJETIVA GLOBAL (ASG)', style: 'sectionTitle' },
        ...sections
      ]
    };
  }

  private createResultsSection(
    pontuacaoASG: number,
    classificacaoASG: string,
    estadoNutricional: string
  ): Content {
    return {
      stack: [
        { text: 'RESULTADOS', style: 'sectionTitle' },
        {
          table: {
            widths: ['*'],
            body: [
              [`Pontuação ASG: ${pontuacaoASG}`],
              [`Classificação ASG: ${classificacaoASG}`],
              [`Estado Nutricional (NRS): ${estadoNutricional}`]
            ]
          },
          layout: 'noBorders'
        }
      ]
    };
  }

  private createObservationsSection(observations?: string): Content {
    return {
      stack: [
        { text: 'OBSERVAÇÕES / EVOLUÇÃO NUTRICIONAL', style: 'sectionTitle' },
        {
          text: observations || 'Nenhuma observação registrada.',
          margin: [0, 5, 0, 0]
        }
      ]
    };
  }

  async savePdfToFirebase(
    paciente: Paciente,
    pdfDocDefinition: TDocumentDefinitions
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      pdfMake.createPdf(pdfDocDefinition).getBlob(async (blob: Blob) => {
        try {
          const pacienteId = paciente.id;
          const dataAtual = new Date().toISOString().split('T')[0];
          const nomeArquivo = `${pacienteId}_${dataAtual}_triagem.pdf`;
          const filePath = `pdfs/${pacienteId}/${nomeArquivo}`;
          const fileRef = this.storage.ref(filePath);
          const task = this.storage.upload(filePath, blob);

          task.snapshotChanges().pipe(
            finalize(async () => {
              try {
                const url = await fileRef.getDownloadURL().toPromise();
                resolve(url);
              } catch (e) {
                reject(e);
              }
            })
          ).subscribe({
            error: (err) => {
              reject(err);
            }
          });
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  private formatLabel(key: string, formType?: string): string {
    if (formType === 'nrs1') {
      const question = this.nrs1OptionsMap[key as keyof typeof this.nrs1OptionsMap];
      return question || key;
    }
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^./, str => str.toUpperCase());
  }

  private formatValue(value: any): string {
    if (value === undefined || value === null) return 'Não informado';
    if (Array.isArray(value)) return this.formatArrayValue(value);
    if (typeof value === 'boolean') return value ? 'Sim' : 'Não';
    if (value instanceof Date) return value.toLocaleDateString('pt-BR');
    if (typeof value === 'number') return value.toFixed(2);
    return String(value);
  }

  private formatArrayValue(value: any[]): string {
    if (!Array.isArray(value)) return 'Não informado';
    return value.length > 0 ? value.join(', ') : 'Nenhum registro';
  }

  private getTableLayout(): CustomTableLayout {
    return {
      hLineWidth: (i: number, node: any) => i === 0 || i === node.table.body.length ? 0 : 0.5,
      vLineWidth: () => 0,
      hLineColor: () => '#cccccc',
      paddingTop: (i: number) => i === 0 ? 0 : 5,
      paddingBottom: () => 5
    };
  }
}
