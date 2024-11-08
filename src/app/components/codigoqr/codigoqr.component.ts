import { AuthService } from 'src/app/services/auth.service';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Usuario } from 'src/app/model/Usuario';
import jsQR, { QRCode } from 'jsqr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-codigoqr',
  templateUrl: './codigoqr.component.html',
  styleUrls: ['./codigoqr.component.scss'],
  standalone: true,
  imports:[IonButton, CommonModule,IonIcon, FormsModule]
})
export class CodigoqrComponent  implements OnInit {

  @ViewChild('video') private video!: ElementRef;
  @ViewChild('canvas') private canvas!: ElementRef;

  public usuario: Usuario = new Usuario();
  public escaneando = false;
  public datosQR: string = '';

  constructor(private authService: AuthService)
  {
    this.authService.usuarioAutenticado.subscribe((UsuarioAutenticado) => {
      if (UsuarioAutenticado) {
        this.usuario = UsuarioAutenticado;
      }
    });

  }

  ngOnInit() {
    this.comenzarEscaneoQR();
  }

  public simularCapturaQR() {
    this.mostrarDatosQROrdenados(`
      {
        "sede": "Alonso Ovalle",
        "idAsignatura": "PGY4121",
        "seccion": "001D",
        "nombreAsignatura": "Aplicaciones Móviles",
        "nombreProfesor": "Cristián Gómez Vega",
        "dia": "2022-08-09",
        "bloqueInicio": 7,
        "bloqueTermino": 9,
        "horaInicio": "13:00",
        "horaFin": "15:15"
      }
    `);
  }

  public async comenzarEscaneoQR() {
    const mediaProvider: MediaProvider = await navigator.mediaDevices.getUserMedia({
      video: {facingMode: 'environment'}
    });
    this.video.nativeElement.srcObject = mediaProvider;
    this.video.nativeElement.setAttribute('playsinline', 'true');
    this.video.nativeElement.play();
    this.escaneando = true;
    requestAnimationFrame(this.verificarVideo.bind(this));
  }

  async verificarVideo() {
    if (this.video.nativeElement.readyState === this.video.nativeElement.HAVE_ENOUGH_DATA) {
      if (this.obtenerDatosQR() || !this.escaneando) return;
      requestAnimationFrame(this.verificarVideo.bind(this));
    } else {
      requestAnimationFrame(this.verificarVideo.bind(this));
    }
  }

  public obtenerDatosQR(): boolean {
    const w: number = this.video.nativeElement.videoWidth;
    const h: number = this.video.nativeElement.videoHeight;
    this.canvas.nativeElement.width = w;
    this.canvas.nativeElement.height = h;
    const context: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d', { willReadFrequently: true });
    context.drawImage(this.video.nativeElement, 0, 0, w, h);
    const img: ImageData = context.getImageData(0, 0, w, h);
    let qrCode: QRCode | null = jsQR(img.data, w, h, { inversionAttempts: 'dontInvert' });
    if (qrCode) {
      if (qrCode.data !== '') {
        this.escaneando = false;
        this.mostrarDatosQROrdenados(qrCode.data);
        return true;
      }
    }
    return false;
  }

  public mostrarDatosQROrdenados(datosQR: string): void {
    this.datosQR = datosQR;
    this.usuario.asistencia = JSON.parse(datosQR);
    this.authService.guardarUsuarioAutenticado(this.usuario);
  }

  public detenerEscaneoQR(): void {
    this.escaneando = false;
  }

}
