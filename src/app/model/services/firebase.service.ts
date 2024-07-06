import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import Paciente from '../entities/Paciente';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private PATH : string = 'pacientes';
  private PATH2 : string = 'usuarios'

  constructor(private angularFirestore : AngularFirestore) { }

  buscarTodos(){
    return this.angularFirestore.collection(this.PATH).snapshotChanges();
  }
  
  cadastrar(paciente : Paciente){
    return this.angularFirestore.collection(this.PATH).add({
      nome: paciente.nome,
      idade: paciente.idade,
      data: paciente.data,
      alergia: paciente.alergia,
      comorbidades: paciente.comorbidades,
      habitoIntestinal: paciente.habitoIntestinal,
      pesoAtual: paciente.pesoAtual,
      pesoUsual: paciente.pesoUsual,
      altura: paciente.altura,
      imc: paciente.imc
    })
  }

  cadastrarUser(usuario: any, uid: string) {
    return this.angularFirestore.collection(this.PATH2).doc(uid).set(usuario);
  }



  editarPaciente(paciente: Paciente, id : string){
    return this.angularFirestore.collection(this.PATH).doc(id).update({
      nome: paciente.nome,
      idade: paciente.idade,
    })
  }

  excluirPaciente(paciente : Paciente){
    return this.angularFirestore.collection(this.PATH).doc(paciente.id).delete()
  }

}
