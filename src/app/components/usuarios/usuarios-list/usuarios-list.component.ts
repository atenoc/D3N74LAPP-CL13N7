import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/Usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { NgbModal, NgbModalConfig, NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
import { CentroService } from 'src/app/services/centro.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios-list.component.html',
  styleUrls: ['./usuarios-list.component.css']
})
export class UsuariosListComponent implements OnInit {

  usuarios: Usuario[] = [];
  usuario:Usuario
  existeCentro:boolean
  formularioDetalleUsuario:FormGroup
  existenUsuarios:boolean=false
  mensajeRegistrarCentro:string
 
  // Paginación
  currentPage = 1;      // actual
  pageSize = 5;         // default size
  orderBy = '';   // orden
  way = 'asc';          // direccion 
  totalElements:number  // total 

  constructor(
    private usuarioService:UsuarioService, 
    private router: Router, 
    private centroService:CentroService,
    private modalService: NgbModal,
    private paginationConfig: NgbPaginationConfig, 
    config: NgbModalConfig) {
      config.backdrop = 'static';
		  config.keyboard = false;
      paginationConfig.pageSize = this.pageSize;
      
     }

  ngOnInit() {

    console.log("USUARIOS LIST COMP")
    if(localStorage.getItem('_us')){

      // Consultar si existe centro
      this.centroService.getCentroByIdUser$(localStorage.getItem('_us')).subscribe(
        res => {
          if(res.id.length > 0){
            this.existeCentro = true
          }else{
            this.existeCentro = false
          }
        },
        err => console.log("error: " + err)
      )

      //Consultar rol
      this.usuarioService.getUsuario$(localStorage.getItem('_us')).subscribe(
        res => {
  
          this.usuario = res;
          console.log("Rol Usuarios: "+this.usuario.desc_rol)
  
          if(this.usuario.desc_rol != "sop" && this.usuario.desc_rol != "admin"){ // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ROL
            this.router.navigate(['/agenda']);
            console.log("No tienes Acceso a esta página!")
          }else{
  
            if(this.usuario.desc_rol == "sop"){  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ROL
              
              this.getUsuariosPaginados();

            }
    
            if(this.usuario.desc_rol == "admin"){ // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ROL
              
              this.getUsuariosPaginados();

            }
  
          }
  
        },
        err => console.log("error: " + err)
      )

    }
  }

  openVerticallyCentered(content) {
    console.log("OPEN MODAL")
		//this.modalService.open(content, { centered: true });
    this.modalService.open(content, { size: 'lg', centered: true });
	}

  selectedIdUser(id: string) {
    console.log("id seleccionado: "+id)
    this.router.navigate(['/usuario-detalle', id]);
  }

  deleteUser(id: string, correo:string) {

    Swal.fire({
      html:
        `¿ Estás seguro de eliminar el usuario: <br/> ` +
        `<strong> ${ correo } </strong> ? `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#aeaeae',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.value) {
        // Confirm
        this.usuarioService.deleteUsuario(id).subscribe(res => {
          console.log("Usuario eliminado:" + JSON.stringify(res))

          Swal.fire({
            icon: 'success',
            showConfirmButton: false,
            text:'¡El usuario ha sido eliminado!',
            timer: 1500
          })

        },
          err => { 
            console.log("error: " + err)
            Swal.fire({
              icon: 'error',
              html:
                `<strong>¡${ err.error.message }!</strong>`,
              showConfirmButton: true,
              confirmButtonColor: '#28a745',
              timer: 4000
            }) 
          }
        )
    
      }
    })

  }

  irUsuarioForm(){
    this.router.navigate(['/usuario-form']);
  }

  getUsuariosPaginados() {
    this.usuarioService
      //.getUsuariosPaginados$(this.currentPage, this.pageSize, this.orderBy, this.way)
      .getUsuariosByUsuarioPaginados$(this.usuario.id, this.currentPage, this.pageSize, this.orderBy, this.way)
      .subscribe((res) => {
        this.usuarios = res.data
        this.totalElements = res.pagination.totalElements
        console.log(res)

        this.existenUsuarios = this.usuarios.length > 0;
        if(!this.existenUsuarios){
          this.mensajeRegistrarCentro='¡Registra un centro dental!'
        }
      });
  }

  onPageChange(event: any) {
    this.currentPage = event;
    this.getUsuariosPaginados();
  }

  onPageSizeChange() {
    this.getUsuariosPaginados();
  }

  onSortChange(campo: string) {
    if (this.orderBy === campo) {
      this.way = this.way === 'asc' ? 'desc' : 'asc';
    } else {
      this.orderBy = campo;
      this.way = 'asc'; // Establece 'asc' como valor predeterminado al cambiar de columna
    }
  
    console.log("Ordenar por: " + this.orderBy);
    console.log("Modo: " + this.way);
    this.getUsuariosPaginados();
  }
  

}
