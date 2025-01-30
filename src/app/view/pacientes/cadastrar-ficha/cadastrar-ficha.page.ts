import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import Paciente from 'src/app/model/entities/Paciente';
import { AuthService } from 'src/app/model/services/auth.service';
import { FirebaseService } from 'src/app/model/services/firebase.service';

@Component({
  selector: 'app-cadastrar-ficha',
  templateUrl: './cadastrar-ficha.page.html',
  styleUrls: ['./cadastrar-ficha.page.scss'],
})
export class CadastrarFichaPage implements OnInit {
  paciente : Paciente;
  public user: any;
  public pacienteId : string;
  public formNRS1 : FormGroup;
  public formNRS2 : FormGroup;
  public formASG: FormGroup;
  public dataAtual: string = '';
  public mostrarParte2: boolean = false;
  public pontuacaoASG: number;
  public classificacaoASG: string;

  constructor(
    private router : Router,
    private authService: AuthService,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private formBuilder : FormBuilder,
    private datePipe: DatePipe,
    private navCtrl: NavController) {
      this.user = this.authService.getUserLogged();
      this.formNRS1 = this.formBuilder.group({
        data: ['', Validators.required],
        pIMC: ['', Validators.required],
        pPerda : ['', Validators.required],
        pReducao : ['', Validators.required],
        pEstado : ['', Validators.required],
      });

      this.formASG = this.formBuilder.group({
        mudancaPeso: ['', Validators.required],
        continuaPerdendoPeso: ['', Validators.required],
        porcetagemPerda: ['',Validators.required],
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
        edema: ['', Validators.required],
        ascite: ['', Validators.required],
      });

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
    
      // Observa as mudanças nos campos de peso
  this.formASG.get('pesoAtual')?.valueChanges.subscribe(() => {
    this.calcularPerdaPeso();
  });
  this.formASG.get('pesoHabitual')?.valueChanges.subscribe(() => {
    this.calcularPerdaPeso();
  });
  
  this.formASG.valueChanges.subscribe(() => { 
    this.atualizarPontuacaoEClassificacao(); 

  });
  }

  voltar() {
    this.navCtrl.back(); // voltar para a pagina anterior
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
  
    if (!isNaN(pesoAtual) && !isNaN(pesoHabitual) && pesoHabitual !== 0) {
      const perdaPeso = ((pesoHabitual - pesoAtual) / pesoHabitual) * 100;
      this.formASG.patchValue({ perdaPeso: perdaPeso.toFixed(1) }); // Atualiza o campo no formulário
      // Verifica se a perda de peso é significativa e define "sim" ou "nao"
      if (perdaPeso > 10) { 
        this.formASG.patchValue({ continuaPerdendoPeso: 'sim' });
      } else {
        this.formASG.patchValue({ continuaPerdendoPeso: 'nao' });
      }
      return perdaPeso;
    } else {
      this.formASG.patchValue({ perdaPeso: null }); // Limpa o campo se os valores forem inválidos
      return 0; // Ou outro valor padrão para indicar erro/ausência de dados
    }
  }

  calcularEstadoNutricional(): string {
    if (!this.formNRS2.valid) {
      return 'Parte 2 incompleta'; // Ou outro valor que indique que a Parte 2 não está completa
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
      case 'ausente': return 0;
      case 'leve': return 1;
      case 'moderado': return 2;
      case 'grave': return 3;
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
    if (parseFloat(this.formASG.get('perdaPeso')?.value) > 0) {
      pontuacao += 2; // Adicionado para perda de peso
    }
    const perdaPeso = parseFloat(this.formASG.get('perdaPeso')?.value);

    if (!isNaN(perdaPeso) && perdaPeso > 10) {
      pontuacao += 2;
    } else {
      pontuacao += 1;
    }
    console.log(pontuacao);
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
    
    console.log(pontuacao);
    // Sintomas Gastrintestinais
    if (formValues.disfagia) {
      pontuacao += 1;
      console.log("disfalgia",pontuacao);
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
    console.log(pontuacao);
  
    // Capacidade Funcional Física
    if (formValues.capacidadeFuncional === 'abaixoNormal') {
      pontuacao += 1;
    } else if (formValues.capacidadeFuncional === 'acamado') {
      pontuacao += 2;
    }
    console.log(pontuacao);
  
    // Diagnóstico
    if (formValues.diagnostico === 'baixoEstresse') {
      pontuacao += 1;
    } else if (formValues.diagnostico === 'moderadoEstresse') {
      pontuacao += 2;
    } else if (formValues.diagnostico === 'altoEstresse') {
      pontuacao += 3;
    }
    console.log(pontuacao);
  
    // Exame Físico
    pontuacao += this.converterValorParaNumero(formValues.perdaGordura);
    pontuacao += this.converterValorParaNumero(formValues.perdaMusculo);
    pontuacao += this.converterValorParaNumero(formValues.edema);
    pontuacao += this.converterValorParaNumero(formValues.ascite);
    console.log(pontuacao);
    return pontuacao;
  }

  classificarEstadoNutricional(pontuacao: number): string {
    console.log("Entrou na classificação do numero");
    if (pontuacao < 17) {
      console.log("Bem nutrido");
      return 'Bem nutrido';
    } else if (pontuacao >= 17 && pontuacao <= 22) {
      console.log("Moderadamente desnutrido");
      return 'Moderadamente desnutrido';
    } else {
      console.log("Gravemente desnutrido");
      return 'Gravemente desnutrido';
    }
  }

  atualizarPontuacaoEClassificacao() {
    this.pontuacaoASG = this.calcularPontuacaoASG();
    this.classificacaoASG = this.classificarEstadoNutricional(this.pontuacaoASG);
    console.log("Pontuação ASG:", this.pontuacaoASG);
    console.log("Classificação:", this.classificacaoASG);
  }
   

}
