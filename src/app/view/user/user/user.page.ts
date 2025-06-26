import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/model/services/auth.service';
import { ToastService } from 'src/app/common/toast.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {

  user: any = null;

  constructor(
    private authService: AuthService,
    private toast: ToastService,
    private router: Router,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    //this.user = this.authService.getUserLogged();
    this.authService.getUserFullData().subscribe(user => {
      this.user = user;
    });
  }

  logout() {
    this.authService.signOut().then((res) => {
      this.toast.show('Logout realizado com sucesso', 'success');
      this.router.navigate(['login']);
    }).catch(() => {
      this.toast.show('Erro ao sair da aplicação', 'danger');
    });
  }

  voltar() {
    this.router.navigate(['home']); // voltar para a pagina anterior
  }

}
