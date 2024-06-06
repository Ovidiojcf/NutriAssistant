import { Injectable } from '@angular/core';
import Paciente from '../entities/Paciente';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  public lista_pacientes : Paciente[] = [];

  constructor() { }

  cadastrar(paciente : Paciente){
    this.lista_pacientes.push(paciente);
  }

  obterTodos() : Paciente[]{
    return this.lista_pacientes;
  }

  obterPoIndice(indice : number) : Paciente{
    return this.lista_pacientes[indice];
  }

  editar(indice : number, paciente : Paciente){
    this.lista_pacientes[indice] = paciente;
  }

  excluir(indice : number){
    this.lista_pacientes.splice(indice,1)
  }
}
