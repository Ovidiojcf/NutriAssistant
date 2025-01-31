import { Component, OnInit } from '@angular/core';
import { PdfGeneratorService } from 'src/app/model/services/pdf-generator.service';

@Component({
  selector: 'app-teste-pdf',
  templateUrl: './teste-pdf.page.html',
  styleUrls: ['./teste-pdf.page.scss'],
})
export class TestePdfPage implements OnInit {

  constructor(private pdfService: PdfGeneratorService) {}
  
    ngOnInit() {}
    gerarPDF() {
      console.log('open the function');
      const paciente = {
        nome: 'Maria Oliveira',
        idade: 35,
        data: '01/02/2025',
        diagnostico: 'Anemia',
        comorbidades: 'Hipertensão',
        alergias: 'Nenhuma',
        habitoIntestinal: 'Irregular',
        mastigacao: 'Normal',
        pesoAtual: 65,
        pesoUsual: 68,
        altura: 1.68,
        imc: 23.0
      };
  
      this.pdfService.generatePdf(paciente);
    }

}
