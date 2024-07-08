import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent  implements OnInit {

  constructor(private router : Router) { }

  ngOnInit() {}
  irParaCadastrarPaciente() {
    this.router.navigate(['cadastrar-paciente']);
  }
  irParaLista(){
    this.router.navigate(['lista-paciente']);
  }

}
