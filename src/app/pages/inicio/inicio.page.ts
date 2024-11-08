import { ForoComponent } from 'src/app/components/foro/foro.component';
import { CodigoqrComponent } from './../../components/codigoqr/codigoqr.component';
import { AuthService } from './../../services/auth.service2';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { Miclase } from 'src/app/model/miclase';
import { MiclaseComponent } from 'src/app/components/miclase/miclase.component';
import { Misdatos } from 'src/app/model/misdatos';
import { MisdatosComponent } from 'src/app/components/misdatos/misdatos.component';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,FooterComponent,
    HeaderComponent,MiclaseComponent,CodigoqrComponent,MiclaseComponent,MiclaseComponent,MisdatosComponent,ForoComponent]
})
export class InicioPage{

  componenteSeleccionada:string = 'codigoqr'

  constructor(private authService: AuthService) {
    this.authService.componenteSeleccionada.subscribe((componenteSeleccionada) => {
      this.componenteSeleccionada = componenteSeleccionada;
    })
  }


}
