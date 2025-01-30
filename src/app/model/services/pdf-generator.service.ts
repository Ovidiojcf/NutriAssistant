import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {

  constructor() {
    (pdfMake as any).vfs = (pdfFonts as any).vfs;
  }

  generatePdf(paciente: any) {
    const dd = {
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
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 12,
          bold: true,
          margin: [0, 0, 0, 3]
        }
      },
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60] as [number, number, number, number],
    };

    pdfMake.createPdf(dd).open();
  }
}

