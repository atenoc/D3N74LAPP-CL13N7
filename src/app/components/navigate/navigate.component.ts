import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/Usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import { CentroService } from 'src/app/services/centro.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-navigate',
  templateUrl: './navigate.component.html',
  styleUrls: ['./navigate.component.css']
})
export class NavigateComponent implements OnInit {

  usuario:Usuario
  idUsuario:string
  correoUsuario: string
  rolUsuario:string
  nombreCentro:string="Dental App"
  mostrarTitulo:boolean=true

  constructor(public authService: AuthService, private centroService:CentroService) { }

  ngOnInit() {
    this.authService.getUsuarioByCorreo$(localStorage.getItem('correo_us')).subscribe(
      res => {
        this.usuario = res;
        this.idUsuario=this.usuario.id
        this.correoUsuario=this.usuario.correo
        this.rolUsuario=this.usuario.rol
        console.log("Rol Navigate: " + this.usuario.rol)

        this.centroService.getCentroByIdUser$(this.idUsuario).subscribe(
          res=>{
            if(res.nombre){
              this.nombreCentro=res.nombre
              this.mostrarTitulo=true
            }else{
              this.mostrarTitulo=false
            }
          },
          err => console.log("error: " + err)
        )
      },
      err => console.log("error: " + err)
    )

    //consulta de localstorage
    //this.authService.mensajeActual.subscribe(correoUsuario => this.correoUsuario = correoUsuario)
    
  }

  reload(){
    this.rolUsuario=""
    this.ngOnInit()
    console.log("reload navigate <-")
  }

}
