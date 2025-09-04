import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import Paciente from 'src/app/model/entities/Paciente';
import { AuthService } from 'src/app/model/services/auth.service';
import { PdfGeneratorService } from 'src/app/model/services/pdf-generator.service';
import { FirebaseService } from 'src/app/model/services/firebase.service';
import { ToastService } from 'src/app/common/toast.service';

@Component({
  selector: 'app-cadastrar-ficha',
  templateUrl: './cadastrar-ficha.page.html',
  styleUrls: ['./cadastrar-ficha.page.scss'],
})
export class CadastrarFichaPage implements OnInit {
  paciente: Paciente;
  public user: any;
  public dataAtual: string = '';
  public mostrarParte2: boolean = false;
  public imcCalculado: number = 0;
  public perdaPeso: number = 0;
  public isGeneratingPdf: boolean = false;

  public formularioNRS: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private pdfGeneratorService: PdfGeneratorService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private datePipe: DatePipe,
    private navCtrl: NavController,
    private toast: ToastService
  ) {
    this.authService.getUserFullData().subscribe((user) => {
      this.user = user;
    });

    // Form principal com grupo aninhado NRS2
    this.formularioNRS = this.formBuilder.group({
      data: ['', Validators.required],
      pIMC: ['', Validators.required],
      pPerda: ['', Validators.required],
      pReducao: ['', Validators.required],
      pEstado: ['', Validators.required],
      pesoAtual: ['', Validators.required],
      pesoHabitual: ['', Validators.required],
      perdaPeso: ['', Validators.required],
      imc: [''],
      evolucaoNutricional: [''],
      nrs2: this.formBuilder.group({
        eNutricionalPrejudicado: ['', Validators.required],
        gravidadeDoenca: ['', Validators.required],
      }),
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(() => {
      const navigation = this.router.getCurrentNavigation();
      if (navigation && navigation.extras && navigation.extras.state) {
        this.paciente = navigation.extras.state['paciente'];

        const dataAtual = new Date();
        this.dataAtual = this.datePipe.transform(dataAtual, 'dd/MM/yyyy')!;
        this.formularioNRS.get('data')?.setValue(this.dataAtual);
      }
    });

    // Observa mudanças
    this.formularioNRS.valueChanges.subscribe(() => this.verificarParte1());

    this.formularioNRS.get('pesoAtual')?.valueChanges.subscribe(() => this.calcularIMC());
    this.formularioNRS.get('pesoHabitual')?.valueChanges.subscribe(() => this.calcularPerdaPeso());
  }

  voltar() {
    this.navCtrl.back();
  }

  calcularIMC() {
    const peso = parseFloat(this.formularioNRS.get('pesoAtual')?.value);
    const altura = parseFloat(this.paciente.altura);
    if (!isNaN(peso) && !isNaN(altura) && altura > 0) {
      this.imcCalculado = peso / (altura * altura);
      this.formularioNRS.patchValue({ imc: this.imcCalculado.toFixed(1) });
    } else {
      this.imcCalculado = 0;
    }
  }

  calcularPerdaPeso() {
    const pesoAtual = parseFloat(this.formularioNRS.get('pesoAtual')?.value);
    const pesoHabitual = parseFloat(this.formularioNRS.get('pesoHabitual')?.value);
    if (!isNaN(pesoAtual) && !isNaN(pesoHabitual) && pesoHabitual > 0) {
      this.perdaPeso = ((pesoHabitual - pesoAtual) / pesoHabitual) * 100;
      this.formularioNRS.patchValue({ perdaPeso: this.perdaPeso.toFixed(1) });
    } else {
      this.perdaPeso = 0;
      this.formularioNRS.patchValue({ perdaPeso: null });
    }
  }

  verificarParte1() {
    const campos = ['pIMC', 'pPerda', 'pReducao', 'pEstado'];
    this.mostrarParte2 = campos.some(campo => this.formularioNRS.get(campo)?.value === 'sim');
    //some: Determines whether the specified callback function returns true for any element of an array.
  }

  calcularEstadoNutricional(): { pontos: number; classificacao: string } {
    const nrs2 = this.formularioNRS.get('nrs2') as FormGroup;
    if (!nrs2 || !nrs2.valid) {
      return { pontos: 0, classificacao: 'Parte 2 incompleta' };
    }

    const valorA = nrs2.get('eNutricionalPrejudicado')?.value;
    const valorB = nrs2.get('gravidadeDoenca')?.value;

    // Soma A + B
    let soma = this.converterValorParaNumero(valorA) + this.converterValorParaNumero(valorB);

    // Regra da idade: +1 ponto se >= 70 anos
    const idade = this.paciente?.idade || 0; // supondo que exista paciente.idade
    if (idade >= 70) {
      soma += 1;
    }

    // Classificação textual
    const classificacao = soma >= 3 ? 'Em risco nutricional' : 'Reavaliar posteriormente';

    return { pontos: soma, classificacao };
  }


  private converterValorParaNumero(valor: string): number {
    switch (valor) {
      case 'Ausente': return 0;
      case 'Leve': return 1;
      case 'Moderado': return 2;
      case 'Grave': return 3;
      default: return 0;
    }
  }

  async gerarESalvarPdf() {
    this.isGeneratingPdf = true;
    try {
      const nrs2 = this.formularioNRS.get('nrs2')?.value;
      const resultadoNRS = this.calcularEstadoNutricional();
      const resumoNRS = `Pontuação NRS: ${resultadoNRS.pontos} – ${resultadoNRS.classificacao}`;
      const docDefinition = this.pdfGeneratorService.buildDocDefinition(
        this.paciente,
        this.formularioNRS.value,
        nrs2,
        resumoNRS
      );

      const pdfUrl = await this.pdfGeneratorService.savePdfToFirebase(this.paciente, docDefinition);
      await this.firebaseService.adicionarPdfAoPaciente(this.paciente.id, pdfUrl, new Date());

      this.toast.show('PDF salvo com sucesso!', 'success');
      this.router.navigate(['/detalhar-paciente'], { state: { paciente: this.paciente } });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      this.toast.show('Falha ao gerar PDF. Tente novamente.', 'danger');
    } finally {
      this.isGeneratingPdf = false;
    }
  }
}
