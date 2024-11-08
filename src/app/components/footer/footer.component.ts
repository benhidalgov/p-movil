import { Subscription } from 'rxjs';
import { AuthService } from './../../services/auth.service2';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonFooter, IonToolbar, IonSegment, IonSegmentButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, pawOutline, pencilOutline, qrCodeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [
      CommonModule    // CGV-Permite usar directivas comunes de Angular
    , FormsModule     // CGV-Permite usar formularios
    , TranslateModule // CGV-Permite usar pipe 'translate'
    , IonFooter, IonToolbar, IonSegment, IonSegmentButton, IonIcon
  ]
})
export class FooterComponent {

  componenteSeleccionada: string = 'codigoqr';
  
  cambiarComponente($event: any) {

    this.componenteSeleccionada = $event.detail.value
    this.authService.componenteSeleccionada.next(this.componenteSeleccionada)
  }

  selectedButton = 'welcome';
  @Output() footerClick = new EventEmitter<string>();

  constructor(private authService: AuthService) {
    addIcons({ homeOutline, qrCodeOutline, pawOutline, pencilOutline });
  }

  sendClickEvent($event: any) {
    this.footerClick.emit(this.selectedButton);
  }

}
