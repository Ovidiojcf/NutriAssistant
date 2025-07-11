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
  public pacienteId: string;
  public formNRS1: FormGroup;
  public formNRS2: FormGroup;
  public formASG: FormGroup;
  public dataAtual: string = '';
  public mostrarParte2: boolean = false;
  public pontuacaoASG: number;
  public classificacaoASG: string;
  public imcCalculado: number = 0;
  public perdaPeso: number = 0;
  public isGeneratingPdf: boolean = false; // Variável para controlar o estado do botão de geração de PDF


  constructor(
    private router: Router,
    private authService: AuthService,
    private pdfGeneratorService: PdfGeneratorService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private datePipe: DatePipe,
    private navCtrl: NavController,
    private toast: ToastService,) {

    this.authService.getUserFullData().subscribe(user => {
      this.user = user;
    });

    this.formNRS1 = this.formBuilder.group({
      data: ['', Validators.required],
      pIMC: ['', Validators.required],
      pPerda: ['', Validators.required],
      pReducao: ['', Validators.required],
      pEstado: ['', Validators.required],
    });

    this.formASG = this.formBuilder.group({
      mudancaPeso: ['', Validators.required],
      continuaPerdendoPeso: ['', Validators.required],
      porcetagemPerda: ['', Validators.required],
      pesoAtual: ['', Validators.required],
      pesoHabitual: ['', Validators.required],
      perdaPeso: ['', Validators.required],
      mudancaDieta: ['', Validators.required],
      dietaHipocalorica: [false],
      dietaPastosaHipocalorica: [false],
      dietaLiquida: [false],
      jejum: [false],
      mudancaPersistente: [false],
      disfagia: [false],
      nauseas: [false],
      vomitos: [false],
      diarreia: [false],
      anorexia: [false],
      capacidadeFuncional: ['', Validators.required],
      diagnostico: ['', Validators.required],
      perdaGordura: ['', Validators.required],
      perdaMusculo: ['', Validators.required],
      edemaSacral: ['', Validators.required],
      edemaTornozelo: ['', Validators.required],
      ascite: ['', Validators.required],
      evolucaoNutricional: ['', Validators.required],
    });

  }
  async gerarESalvarPdf() {

    if (!this.formNRS1.valid || !this.formASG.valid || (this.mostrarParte2 && !this.formNRS2?.valid)) {
      this.toast.show('Preencha todos os campos obrigatórios!', 'warning');
      return; // Sai da função sem ativar o spinner
    }
     // Desabilita o botão enquanto gera o PDF
    this.isGeneratingPdf = true;

    try {
      const nrs2Padrao = {
      eNutricionalPrejudicado: 'Ausente',
      gravidadeDoenca: 'Ausente'
    };
    const formNRS2ParaPdf = this.formNRS2?.value || nrs2Padrao;

    const formASGParaPdf = {
      ...this.formASG.value,
      imc: this.imcCalculado,
      perdaPeso: this.perdaPeso
    };


    const docDefinition = this.pdfGeneratorService['buildDocDefinition'](
      this.paciente,
      this.formNRS1.value,
      formNRS2ParaPdf,
      formASGParaPdf, // Aqui já está evolucaoNutricional, pesoAtual, pesoHabitual, imc, etc.
      this.pontuacaoASG,
      this.classificacaoASG,
      this.calcularEstadoNutricional()
    );

    const pdfUrl = await this.pdfGeneratorService.savePdfToFirebase(this.paciente, docDefinition);
    await this.firebaseService.adicionarPdfAoPaciente(this.paciente.id, pdfUrl, new Date());
    this.toast.show('PDF salvo com sucesso!', 'success');
    this.router.navigate(['/detalhar-paciente'], { state: { paciente: this.paciente } });

    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      this.toast.show('Falha ao gerar PDF. Tente novamente.', 'danger');
    } finally{
      // Desativa o loading
      this.isGeneratingPdf = false;
    }
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const navigation = this.router.getCurrentNavigation();
      if (navigation && navigation.extras && navigation.extras.state) {
        this.paciente = navigation.extras.state['paciente'];

        const dataAtual = new Date();
        const horaAtual = dataAtual.toTimeString().split(' ')[0];
        this.formNRS1.get('data')?.setValue(this.datePipe.transform(dataAtual, 'dd/MM/yyyy'));
        this.formNRS1.get('hora')?.setValue(horaAtual);
      } else {
        console.error('Dados do paciente não encontrados na navegação.');
      }
    });
    this.formNRS1.valueChanges.subscribe(() => { // Observa as mudanças no formNRS1
      this.verificarParte1();
    });

    this.formASG.valueChanges.subscribe(() => {
      this.atualizarPontuacaoEClassificacao();
    });

    this.formASG.get('pesoAtual')?.valueChanges.subscribe(() => {
      this.calcularIMC();
    });

    this.formASG.get('pesoHabitual')?.valueChanges.subscribe(() => {
      this.calcularPerdaPeso();
    });

  }

  voltar() {
    this.navCtrl.back();
  }

  calcularIMC() {
    const peso = parseFloat(this.formASG.get('pesoAtual')?.value);
    const altura = parseFloat(this.paciente.altura);
    if (!isNaN(peso) && !isNaN(altura) && altura > 0) {
      this.imcCalculado = peso / (altura * altura);
    } else {
      this.imcCalculado = 0;
    }
  }

  verificarParte1() {
    if (this.formNRS1.valid) {
      const parte1Respostas = ['pIMC', 'pPerda', 'pReducao', 'pEstado'];
      const simNaParte1 = parte1Respostas.some(campo => this.formNRS1.get(campo)?.value === 'sim');
      this.mostrarParte2 = simNaParte1;

      if (this.mostrarParte2) {
        // Cria o formNRS2 apenas se a Parte 2 for exibida
        this.formNRS2 = this.formBuilder.group({
          eNutricionalPrejudicado: ['', Validators.required],
          gravidadeDoenca: ['', Validators.required],
        });
      }
    } else {
      // Se o formulário NRS1 não for válido, esconde a Parte 2
      this.mostrarParte2 = false;
    }
  }

  calcularPerdaPeso() {
    const pesoAtual = parseFloat(this.formASG.get('pesoAtual')?.value);
    const pesoHabitual = parseFloat(this.formASG.get('pesoHabitual')?.value);

    if (!isNaN(pesoAtual) && !isNaN(pesoHabitual) && pesoHabitual > 0) {
      this.perdaPeso = ((pesoHabitual - pesoAtual) / pesoHabitual) * 100;

      // Atualiza o campo do formASG se necessário
      this.formASG.patchValue({ perdaPeso: this.perdaPeso.toFixed(1) });

      // Atualiza continuaPerdendoPeso no formASG
      if (this.perdaPeso > 10) {
        this.formASG.patchValue({ continuaPerdendoPeso: 'sim' });
      } else {
        this.formASG.patchValue({ continuaPerdendoPeso: 'nao' });
      }
    } else {
      this.perdaPeso = 0;
      this.formASG.patchValue({ perdaPeso: null, continuaPerdendoPeso: null });
    }
  }

  calcularEstadoNutricional(): string {
    if (!this.formNRS2 || !this.formNRS2.valid) {
      return 'Parte 2 incompleta';
    }
    const valorA = this.formNRS2.get('eNutricionalPrejudicado')?.value;
    const valorB = this.formNRS2.get('gravidadeDoenca')?.value;
    const soma = this.converterValorParaNumero(valorA) + this.converterValorParaNumero(valorB);

    if (soma >= 3) {
      return 'Em risco nutricional';
    } else {
      return 'Reavaliar posteriormente';
    }
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

  calcularPontuacaoASG(): number {
    let pontuacao = 0;
    const formValues = this.formASG.value;

    // Peso
    if (formValues.mudancaPeso === 'sim') {
      pontuacao += 1;
    }
    if (formValues.continuaPerdendoPeso === 'sim') {
      pontuacao += 1;
    }

    if (formValues.mudancaPeso === 'sim' || formValues.continuaPerdendoPeso === 'sim') {
      const perdaPeso = parseFloat(this.formASG.get('perdaPeso')?.value);
      if (!isNaN(perdaPeso) && perdaPeso > 0) {
        pontuacao += 2; // Perda de peso presente
        if (perdaPeso > 10) {
          pontuacao += 2;
        } else {
          pontuacao += 1;
        }
      }
    }

    // Dieta
    if (formValues.mudancaDieta === 'sim') {
      pontuacao += 1;
    }
    if (formValues.dietaHipocalorica) {
      pontuacao += 1;
    }
    if (formValues.dietaPastosaHipocalorica) {
      pontuacao += 1;
    }
    if (formValues.dietaLiquida) {
      pontuacao += 2;
    }
    if (formValues.jejum) {
      pontuacao += 3;
    }
    if (formValues.mudancaPersistente) {
      pontuacao += 4;
    }

    // Sintomas Gastrintestinais
    if (formValues.disfagia) {
      pontuacao += 1;
    }
    if (formValues.nauseas) {
      pontuacao += 1;
    }
    if (formValues.vomitos) {
      pontuacao += 1;
    }
    if (formValues.diarreia) {
      pontuacao += 1;
    }
    if (formValues.anorexia) {
      pontuacao += 2;
    }

    // Capacidade Funcional Física
    if (formValues.capacidadeFuncional === 'abaixoNormal') {
      pontuacao += 1;
    } else if (formValues.capacidadeFuncional === 'acamado') {
      pontuacao += 2;
    }

    // Diagnóstico
    if (formValues.diagnostico === 'baixoEstresse') {
      pontuacao += 1;
    } else if (formValues.diagnostico === 'moderadoEstresse') {
      pontuacao += 2;
    } else if (formValues.diagnostico === 'altoEstresse') {
      pontuacao += 3;
    }

    // Exame Físico
    pontuacao += this.converterValorParaNumero(formValues.perdaGordura);
    pontuacao += this.converterValorParaNumero(formValues.perdaMusculo);
    pontuacao += this.converterValorParaNumero(formValues.edemaSacral);
    pontuacao += this.converterValorParaNumero(formValues.edemaTornozelo);
    pontuacao += this.converterValorParaNumero(formValues.ascite);

    return pontuacao;
  }

  classificarEstadoNutricional(pontuacao: number): string {
    if (pontuacao < 17) {
      return 'Bem nutrido';
    } else if (pontuacao >= 17 && pontuacao <= 22) {
      return 'Moderadamente desnutrido';
    } else {
      return 'Gravemente desnutrido';
    }
  }

  atualizarPontuacaoEClassificacao() {
    this.pontuacaoASG = this.calcularPontuacaoASG();
    this.classificacaoASG = this.classificarEstadoNutricional(this.pontuacaoASG);
  }


}
