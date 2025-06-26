import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/common/alert.service';
import Paciente from 'src/app/model/entities/Paciente';
import { AuthService } from 'src/app/model/services/auth.service';
import { FirebaseService } from 'src/app/model/services/firebase.service';
import { LayoutService } from 'src/app/shared/services/layout.service';
import { ToastService } from 'src/app/common/toast.service';

@Component({
  selector: 'app-cadastrar-paciente',
  templateUrl: './cadastrar-paciente.page.html',
  styleUrls: ['./cadastrar-paciente.page.scss'],
})
export class CadastrarPacientePage implements OnInit {
  paciente: Paciente; // Variavel para guardar o objeto paciente
  public user: any; // Dados do usuário logado
  formPaciente: FormGroup; // Huardar os dados do formulário sobre o paciente
  dataAtual: Date = new Date();

  constructor(
    public layout: LayoutService,
    private alertService: AlertService,
    private toast: ToastService,
    private router: Router,
    private authService: AuthService,
    private firebaseService: FirebaseService,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.authService.getUserFullData().subscribe(user => {
      this.user = user;
    });
    this.formPaciente = this.formBuilder.group({
      nome: new FormControl(''),
      idade: new FormControl(''),
      data: new FormControl(this.dataAtual),
      alergias: this.formBuilder.array([]),
      comorbidades: new FormControl(''),
      habitoIntestinal: new FormControl(''),
      altura: new FormControl('', [Validators.required, Validators.min(0.01)]),
    });
  }

  ngOnInit() {
    this.paciente = history.state.paciente;
  }

  cadastrarPaciente(formPaciente: FormGroup) {
    if (formPaciente.valid) {
      const dataAtual = new Date().toISOString().slice(0, 10); // Obter data atual no formato YYYY-MM-DD
      formPaciente.controls['data'].setValue(dataAtual); // Definir a data no FormControl
      const altura = parseFloat(formPaciente.value.altura.replace(',', '.'));

      let novo: Paciente = new Paciente(
        formPaciente.value.nome,
        formPaciente.value.idade,
        new Date(dataAtual),
        this.alergias.value.filter((alergia: string) => alergia !== ''),
        formPaciente.value.comorbidades,
        formPaciente.value.habitoIntestinal,
        formPaciente.value.altura,
      );
      novo.uid = this.user.uid;
      this.firebaseService.cadastrar(novo).then(() => {
        this.toast.show('Paciente salvo com sucesso!', 'success');
        this.router.navigate(["/home"]);
        this.formPaciente.reset();
      }).catch((error) => {
        this.alertService.presentAlert("Erro", "Erro ao cadastrar paciente: " + error.message);
        console.error(error);
      });
    } else {
      this.toast.show('Campos obrigatórios Faltantes!', 'warning');
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


}
