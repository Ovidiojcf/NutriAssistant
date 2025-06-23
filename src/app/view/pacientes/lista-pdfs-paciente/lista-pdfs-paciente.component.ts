import { Component, OnInit, Input } from '@angular/core';
import { FirebaseService } from 'src/app/model/services/firebase.service';


@Component({
  selector: 'app-lista-pdfs-paciente',
  templateUrl: './lista-pdfs-paciente.component.html',
  styleUrls: ['./lista-pdfs-paciente.component.scss'],
})
export class ListaPdfsPacienteComponent  implements OnInit {
  @Input() pacienteId: string;
  pdfs: any[] = [];

  constructor( private firebaseService: FirebaseService ) { }

  ngOnInit() {
    if (this.pacienteId) {
      this.firebaseService.listarPdfsDoPaciente(this.pacienteId).subscribe(pdfs => {
        this.pdfs = pdfs;
      });
    }
  }

}
