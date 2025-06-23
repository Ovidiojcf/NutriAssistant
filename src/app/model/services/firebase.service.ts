import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import Paciente from '../entities/Paciente';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private PATH : string = 'pacientes';
  private PATH2 : string = 'usuarios';
  private PATH3: string = 'formularios';

  constructor(private angularFirestore : AngularFirestore) { }

  buscarTodos(){
    return this.angularFirestore.collection(this.PATH).snapshotChanges();
  }

  cadastrar(paciente : Paciente){
    return this.angularFirestore.collection(this.PATH).add({
      nome: paciente.nome,
      idade: paciente.idade,
      data: paciente.data,
      alergias: paciente.alergias,
      comorbidades: paciente.comorbidades,
      habitoIntestinal: paciente.habitoIntestinal,
      altura: paciente.altura,
    })
  }
  read(){
    return this.angularFirestore.collection(this.PATH)
    .snapshotChanges();
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

  adicionarPdfAoPaciente(pacienteId: string, pdfUrl: String, data: Date){
    return this.angularFirestore.collection('pacientes')
      .doc(pacienteId)
      .collection('pdfs')
      .add({url: pdfUrl, data: data});
  }

  listarPdfsDoPaciente(pacienteId: string) {
  return this.angularFirestore
    .collection('pacientes')
    .doc(pacienteId)
    .collection('pdfs', ref => ref.orderBy('data', 'desc'))
    .valueChanges({ idField: 'id' });
}

}
