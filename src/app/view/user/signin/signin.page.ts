import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/common/alert.service';
import { AuthService } from 'src/app/model/services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
  formLogar: FormGroup;

  constructor(private router : Router,
    private alertService : AlertService,
    private authService : AuthService,
    private formBuilder : FormBuilder){
      this.formLogar = new FormGroup({
        email: new FormControl(''),
        senha: new FormControl('')
      });
  }

  ngOnInit(){
    this.formLogar = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]], //required => campo obrigatorio / validacao de email
      senha: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  get errorControl(){
    return this.formLogar.controls;
  }

  private logar(){
    console.log('Efetuando Login')
    this.authService.signIn(this.formLogar.value['email'],
    this.formLogar.value['senha']).then((res)=>{
      this.alertService.presentAlert("Olá", "Seja Bem Vindo ao Nutri Assistant")
      this.router.navigate(['home']);
    })
    .catch((error)=>{
      this.alertService.presentAlert("Erro","Não foi possível Logar no Sistema")
      console.log(error.message)
    })
  }

  submitForm() : boolean{
    if(!this.formLogar.valid){
      this.alertService.presentAlert("Erro", "Erro ao Preencher campo!!")
      return false;
    }else{
      this.logar();
      return true;
    }
  }

  irParaSignUp(){
    this.router.navigate(["cadastar-user"]);
  }

}
