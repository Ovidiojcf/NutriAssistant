import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/common/alert.service';
import Paciente from 'src/app/model/entities/Paciente';
import { AuthService } from 'src/app/model/services/auth.service';
import { FirebaseService } from 'src/app/model/services/firebase.service';

@Component({
  selector: 'app-cadastrar-paciente',
  templateUrl: './cadastrar-paciente.page.html',
  styleUrls: ['./cadastrar-paciente.page.scss'],
})
export class CadastrarPacientePage implements OnInit {
  paciente : Paciente; // Variavel para guardar o objeto paciente
  public user : any; // Dados do usuário logado
  formPaciente: FormGroup; // Huardar os dados do formulário sobre o paciente
  dataAtual: Date = new Date();
  
  constructor(
    private alertService: AlertService,
    private router: Router,
    private authService: AuthService,
    private firebaseService: FirebaseService,
    private formBuilder : FormBuilder,
    private changeDetectorRef: ChangeDetectorRef
  ) { 
    this.user = this.authService.getUserLogged();
    this.formPaciente = new FormGroup({
      nome: new FormControl(''),
      idade: new FormControl(''),
      data: new FormControl(this.dataAtual),
      alergias: this.formBuilder.array([]),
      comorbidades: new FormControl(''),
      habitoIntestinal: new FormControl(''),
      pesoAtual: new FormControl('', [Validators.required, Validators.min(1)]),
      pesoUsual: new FormControl('', [Validators.required, Validators.min(1)] ),
      altura: new FormControl('', [Validators.required, Validators.min(0.01)]),
      imc: new FormControl({ value: '', disabled: true })
    });
  }

  ngOnInit() {
    this.paciente = history.state.paciente;
  }

  cadastrarPaciente(formPaciente : FormGroup){
      if(formPaciente.valid){
        const dataAtual = new Date().toISOString().slice(0, 10); // Obter data atual no formato YYYY-MM-DD
        formPaciente.controls['data'].setValue(dataAtual); // Definir a data no FormControl
        const pesoAtual = parseFloat(formPaciente.value.pesoAtual.replace(',', '.')); // Substitui vírgula por ponto
        const altura = parseFloat(formPaciente.value.altura.replace(',', '.'));
        console.log(pesoAtual)
        console.log(altura)
        const imcCalculado = this.calcularIMC(pesoAtual, altura);

        let novo : Paciente = new Paciente(
          formPaciente.value.nome,
          formPaciente.value.idade,
          new Date(dataAtual),
          this.alergias.value.filter((alergia: string) => alergia !== ''),
          formPaciente.value.comorbidades, 
          formPaciente.value.habitoIntestinal,
          formPaciente.value.pesoAtual,
          formPaciente.value.pesoUsual,
          formPaciente.value.altura,
          imcCalculado);
        novo.uid = this.user.uid;
        this.firebaseService.cadastrar(novo).then(() => {
          this.alertService.presentAlert("Sucesso", "Paciente Salvo!");
          this.router.navigate(["/home"]);
          this.formPaciente.reset(); 
        }).catch((error) => {
          this.alertService.presentAlert("Erro", "Erro ao cadastrar paciente: " + error.message);
          console.error(error);
        });
      }else {
        this.alertService.presentAlert("Erro", "Campos Obrigatórios!");
      }
  }

  voltar() {
    this.router.navigateByUrl('/home'); // Navega para a rota desejada
  }

  get alergias() {
    return this.formPaciente.get('alergias') as FormArray;
  }
  
  adicionarAlergia() {
    this.alergias.push(this.formBuilder.control('')); 
    this.changeDetectorRef.detectChanges(); // Força a atualização da tela
  }
  
  removerAlergia(index: number) {
    this.alergias.removeAt(index);
  }

  calcularIMC(peso: number, altura: number): number {
    if (altura === 0) return 0;
    return peso / (altura * altura);
  }
  /*
  atualizarIMC() {
    const peso = this.limparENormalizar(this.formPaciente.value.pesoAtual);
    const altura = this.limparENormalizar(this.formPaciente.value.altura);
    console.log('Peso:', peso);
    console.log('Altura:', altura);
    if (!isNaN(peso) && !isNaN(altura) && altura !== 0) {
      const imc = this.calcularIMC(peso, altura);
      this.formPaciente.controls['imc'].setValue(imc.toFixed(2)); 
    } else {
      this.formPaciente.controls['imc'].setValue(''); 
    }
    this.changeDetectorRef.detectChanges(); 
  }*/

  
}
