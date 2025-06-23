import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import Paciente from '../entities/Paciente';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {

  constructor(
    private storage: AngularFireStorage,
  ) {
    (pdfMake as any).vfs = (pdfFonts as any).vfs;
  }

  generatePdf(
    paciente: Paciente,
    formNRS1: any,
    formNRS2: any,
    formASG: any,
    pontuacaoASG: number,
    classificacaoASG: string,
    estadoNutricional: string,
  ): void {
    const docDefinition = this.buildDocDefinition(
      paciente, formNRS1, formNRS2, formASG, pontuacaoASG, classificacaoASG, estadoNutricional,
    );
    
    pdfMake.createPdf(docDefinition).open();
  }

  private buildDocDefinition(
    paciente: Paciente,
    formNRS1: any,
    formNRS2: any,
    formASG: any,
    pontuacaoASG: number,
    classificacaoASG: string,
    estadoNutricional: string
  ): import('pdfmake/interfaces').TDocumentDefinitions {
    return {
      content: [
        { text: 'Ficha Nutricional', style: 'header', alignment: 'center', margin: [0, 0, 0, 20] },

        { text: 'Dados do Paciente', style: 'sectionHeader' },
        {
          table: {
            widths: ['40%', '60%'],
            body: [
              ['Nome', paciente.nome],
              ['Idade', paciente.idade?.toString() ?? ''],
              ['Data', formNRS1.data ?? ''],
              ['Alergias', Array.isArray(paciente.alergias) ? paciente.alergias.join(', ') : ''],
              ['Comorbidades', paciente.comorbidades ?? ''],
              ['Hábito Intestinal', paciente.habitoIntestinal ?? ''],
              ['Peso Atual', formASG.pesoAtual ?? ''],
              ['Peso Habitual', formASG.pesoHabitual ?? ''],
              ['Altura', paciente.altura ?? ''],
              ['IMC', formASG.imc ?? '']
            ]
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 20]
        },

        { text: 'Parte 1 - NRS', style: 'sectionHeader' },
        {
          table: {
            widths: ['40%', '60%'],
            body: Object.entries(formNRS1 || {}).map(([key, value]) => [this.formatLabel(key), this.formatValue(value)])
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 10]
        },

        { text: 'Parte 2 - NRS', style: 'sectionHeader' },
        {
          table: {
            widths: ['40%', '60%'],
            body: Object.entries(formNRS2 || {}).map(([key, value]) => [this.formatLabel(key), this.formatValue(value)])
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 10]
        },

        { text: 'Avaliação Subjetiva Global (ASG)', style: 'sectionHeader' },
        {
          table: {
            widths: ['40%', '60%'],
            body: Object.entries(formASG || {}).map(([key, value]) => [this.formatLabel(key), this.formatValue(value)])
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 10]
        },

        { text: 'Resultados', style: 'sectionHeader' },
        {
          ul: [
            { text: `Pontuação ASG: ${pontuacaoASG}`, bold: true },
            { text: `Classificação ASG: ${classificacaoASG}`, bold: true },
            { text: `Estado Nutricional (NRS): ${estadoNutricional}`, bold: true }
          ]
        },
        { text: 'Evolução Nutricional / Observações', style: 'sectionHeader' },
        {
          text: formASG.evolucaoNutricional || 'Não informado',
          margin: [0, 0, 0, 10]
        },
      ],
      styles: {
        header: { fontSize: 20, bold: true, margin: [0, 0, 0, 20], color: '#2e7d32' },
        sectionHeader: { fontSize: 14, bold: true, margin: [0, 15, 0, 8], color: '#1b5e20' }
      },
      defaultStyle: {
        fontSize: 12
      }
    };
  }

  async savePdfToFirebase(
    paciente: Paciente,
    pdfDocDefinition: any
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      pdfMake.createPdf(pdfDocDefinition).getBlob(async (blob: Blob) => {
        try {
          const nomePaciente = paciente.nome.replace(/\s+/g, '_'); // Substitui espaços por _
          const dataAtual = new Date().toISOString().split('T')[0]; // yyyy-mm-dd
          const nomeArquivo = `${nomePaciente}_${dataAtual}_triagem.pdf`;
          const filePath = `pdfs/${nomePaciente}/${nomeArquivo}`;
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

  // Função auxiliar para formatar labels (opcional, pode personalizar)
  private formatLabel(label: string): string {
    // Exemplo: transforma camelCase ou snake_case em texto legível
    return label
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^./, str => str.toUpperCase());
  }

  // Função auxiliar para formatar valores (opcional)
  private formatValue(value: any): string {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'boolean') {
      return value ? 'Sim' : 'Não';
    }
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }
    return value !== undefined && value !== null ? value.toString() : '';
  }
}
