import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Paciente from 'src/app/model/entities/Paciente';
import { AuthService } from 'src/app/model/services/auth.service';
import { FirebaseService } from 'src/app/model/services/firebase.service';
import { LayoutService } from 'src/app/shared/services/layout.service';

@Component({
  selector: 'app-lista-paciente',
  templateUrl: './lista-paciente.page.html',
  styleUrls: ['./lista-paciente.page.scss'],
})
export class ListaPacientePage {

  public lista_pacientes: Paciente[] = [];
  paciente : Paciente[] = [];
  public user : any;
  public searchTerm: string = ''; // Termo de busca

  constructor(
    public layout: LayoutService,
    private router : Router,
    private authService: AuthService,
    private firebaseService: FirebaseService
  ) { 
    this.firebaseService.read().subscribe( res =>{
      this.lista_pacientes = res.map( paciente =>{
        return{
          id: paciente.payload.doc.id,
          ... paciente.payload.doc.data() as any
        } as Paciente;
      });
      this.paciente = this.lista_pacientes;
      this.ordenarPorNome();
    })
  }



  voltar() {
    this.router.navigateByUrl('/home'); // Navega para a rota desejada
  }
  irDetalhar(){
    this.router.navigate(['/detalhar-paciente']);
  }
  irCadastrar(){
    this.router.navigate(['cadastrar-paciente']);
  }
  filtrarPaciente() {
    if (this.searchTerm.trim() === '') {
      this.paciente = this.lista_pacientes; // Mostra todos os atletas se a busca estiver vazia
      this.ordenarPorNome(); // Ordena novamente após limpar a busca
    } else {
      this.paciente = this.lista_pacientes.filter((paciente) =>
        paciente.nome.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  ordenarPorNome() {
    this.paciente.sort((a, b) => a.nome.localeCompare(b.nome));
  }

  detalhar(paciente: Paciente) {
    this.router.navigateByUrl('/detalhar-paciente', { state: { paciente: paciente } });
  }
}
