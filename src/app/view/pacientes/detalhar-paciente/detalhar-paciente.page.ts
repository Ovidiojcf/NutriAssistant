import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/common/alert.service';
import Paciente from 'src/app/model/entities/Paciente';
import { AuthService } from 'src/app/model/services/auth.service';
import { FirebaseService } from 'src/app/model/services/firebase.service';

@Component({
  selector: 'app-detalhar-paciente',
  templateUrl: './detalhar-paciente.page.html',
  styleUrls: ['./detalhar-paciente.page.scss'],
})
export class DetalharPacientePage implements OnInit {
  paciente!: Paciente;
  public user: any;
  public formDetalhes!: FormGroup;
  
  constructor(
    private alertService: AlertService,
    private router: Router,
    private authService: AuthService,
    private firebaseService: FirebaseService,
    private formBuilder : FormBuilder,
    ) { 
      this.user = this.authService.getUserLogged();
    }

  ngOnInit() {
  }

  voltar() {
    this.router.navigate(['/home']); // Navega para a rota desejada
  }

}
