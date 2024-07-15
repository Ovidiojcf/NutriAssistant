import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/common/alert.service';
import { AuthService } from 'src/app/model/services/auth.service';
import { FirebaseService } from 'src/app/model/services/firebase.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  formCadastrar: FormGroup;


  constructor( 
    private alertService: AlertService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private firebaseService: FirebaseService
  ){ 
      this.formCadastrar = new FormGroup({
        email: new FormControl(''),
        senha: new FormControl(''),
        confSenha: new FormControl('')
      });
    }

  ngOnInit() {
    this.formCadastrar = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confSenha: ['',[Validators.required, Validators.minLength(6)]],
      name: ['', Validators.required],
      ra: ['', Validators.required]
    })
  }

  get errorControl(){
    return this.formCadastrar.controls
  }

  submitForm() : boolean{
    if(!this.formCadastrar.valid){
      this.alertService.presentAlert("Erro", "Erro ao Preencher campo!!")
      return false;
    }else{
      this.cadastrarWithName();
      return true;
    }
  }


  private async cadastrarWithName() {
    try {
      const { email, senha, name, ra } = this.formCadastrar.value;

      const userCredential = await this.authService.signUpWithEmailAndPassword(email, senha);

      const user = userCredential.user;
      if (user) {
        const userData = {
          name,
          ra: parseInt(ra, 10)
        };

        await this.firebaseService.cadastrarUser(userData, user.uid); // Passa o uid para o FirebaseService

        this.alertService.presentAlert("Cadastro", "Cadastro realizado com sucesso");
        this.router.navigate(['login']);
      }
    } catch (error) {
      this.alertService.presentAlert("Cadastro", "Erro ao cadastrar o Nome do Usuario");
      console.error(error);
    }
  }
  
  voltar() {
    this.router.navigateByUrl('/home'); // Navega para a rota desejada
  }

}
