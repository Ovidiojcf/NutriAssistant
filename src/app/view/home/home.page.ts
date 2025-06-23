import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/model/services/auth.service';
import { LayoutService } from 'src/app/shared/services/layout.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage   {
  public user: any;
  
  constructor( private router : Router, private authService: AuthService, public layout: LayoutService) { 
    this.authService.getUserFullData().subscribe(user => {
      this.user = user;
    });
  }


  irParaLista(){
    console.log('Entrando na Lista de Pacientes');
    this.router.navigate(['lista-paciente']);
  }
  irParaCadastrarPaciente() {
    this.router.navigate(['cadastrar-paciente']);
  }
  irPerfil(){
    this.router.navigate(['user']);
  }

}
