import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { PageSize } from 'pdfmake/interfaces';

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {

  constructor() {
    //(pdfMake as any).vfs = (pdfFonts as any).vfs;
    (window as any).pdfMake.vfs = (pdfFonts as any).vfs;
  }

  generatePdf(paciente : any) {
    const docDefinition = {
      content: [
        {
          text: 'Ficha de Triagem NRS 2002',
          style: 'header'
        },
        {
          columns: [
            {
              width: '*',
              text: `Paciente: ${paciente.nome}`,
              style: 'subheader'
            },
            {
              width: '*',
              text: `Idade: ${paciente.idade}`,
              style: 'subheader'
            },
            {
              width: 100,
              text: `Data: ${paciente.data}`,
              style: 'subheader'
            }
          ],
          columnGap: 10
        },
        {
          text: `Diagnóstico principal: ${paciente.diagnostico || ''}`,
          style: 'subheader'
        },
        {
          text: `Comorbidades: ${paciente.comorbidades || ''}`,
          style: 'subheader'
        },
        {
          text: `Alergias ou Intolerância Alimentar: ${paciente.alergias || ''}`,
          style: 'subheader'
        },
        {
          text: `Hábito Intestinal: ${paciente.habitoIntestinal || ''}`,
          style: 'subheader'
        },
        {
          text: `Mastigação: ${paciente.mastigacao || ''}`,
          style: 'subheader'
        },
        {
          columns: [
            {
              width: '*',
              text: `Peso Atual(Kg): ${paciente.pesoAtual || ''}`,
              style: 'subheader'
            },
            {
              width: '*',
              text: `Peso Usual(Kg): ${paciente.pesoUsual || ''}`,
              style: 'subheader'
            },
            {
              width: '*',
              text: `Altura(m): ${paciente.altura || ''}`,
              style: 'subheader'
            },
            {
              width: '*',
              text: `IMC: ${paciente.imc || ''}`,
              style: 'subheader'
            }
          ],
          columnGap: 10
        },
        { text: 'Parte 1', style: 'header' },
        {
          style: 'tableExample',
          table: {
            widths: ['auto', '*'],
            body: [
              [{ text: 'Pergunta', style: 'tableHeader' }, { text: 'Resposta', style: 'tableHeader' }],
              ['1. O IMC do paciente é < 20,5 kg/m²?', 'Selecione'],
              ['2. O paciente teve perda de peso não-intencional nos últimos três meses?', 'Selecione'],
              ['3. O paciente teve redução na ingestão alimentar na última semana?', 'Selecione'],
              ['4. O paciente está em estado grave, mau estado geral ou em terapia intensiva?', 'Selecione']
            ]
          }
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10] as [number, number, number, number]
        },
        subheader: {
          fontSize: 12,
          bold: true,
          margin: [0, 0, 0, 3] as [number, number, number, number]
        }
      },
      pageSize: 'A4' as PageSize,
      pageMargins: [40, 60, 40, 60] as [number, number, number, number],
    };

    pdfMake.createPdf(docDefinition).download('test.pdf');
  }
}

