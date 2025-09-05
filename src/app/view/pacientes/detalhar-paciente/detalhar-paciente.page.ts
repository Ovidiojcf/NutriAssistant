import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import Paciente from 'src/app/model/entities/Paciente';
import { AuthService } from 'src/app/model/services/auth.service';
import { ToastService } from 'src/app/common/toast.service';
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
    private router: Router,
    private authService: AuthService,
    private navCtrl: NavController,
    private toast: ToastService,
    private route: ActivatedRoute,
    private firebaseService: FirebaseService
    ) {
      this.authService.getUserFullData().subscribe(user => {
        this.user = user;
      });
    }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.firebaseService.getPacienteById(id).subscribe(paciente => {
        if (paciente) {
          this.paciente = paciente;
        } else {
          this.toast.show('Paciente não encontrado.', 'danger');
          this.navCtrl.back();
        }
      });
    } else {
      this.toast.show('ID inválido.', 'danger');
      this.navCtrl.back();
    }
  }


  voltar() {
    this.router.navigateByUrl('/lista-paciente'); // Navega para a rota desejada
  }
  cadastrarFicha() {
    if (this.paciente) {
      this.router.navigate(['/cadastrar-ficha'], { state: { paciente: this.paciente } });
    } else {
      this.toast.show('Paciente não carregado. Tente novamente.', 'danger');
    }
  }
}
