import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Usuario } from '../models/Usuario.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //URI = 'http://localhost:4000/api/seguridad';
  URI = environment.urlApiSeguridad

  private usuario$: Subject<Usuario>;

  // usuario almacenado en localstorage, para al actualizar la página obtenga el usuario logueado en el componente navigate
  //private messageSource = new BehaviorSubject<string>(localStorage.getItem('usuario')) 
  //mensajeActual = this.messageSource.asObservable()

  constructor(private http: HttpClient, private router:Router) {
    this.usuario$ = new Subject();
  }

  registro(user){
    return this.http.post<any>(this.URI + '/registro', user)
  }

  login(user){
    console.log("usuario enviado: "+ JSON.stringify(user))
    return this.http.post<any>(this.URI + '/login', user)
  }

  getUsuarioByCorreo$(correo: string) {
    this.http.get<Usuario>(`${this.URI}/userbycorreo/${correo}`).subscribe(
      res=>{
        this.usuario$.next(res)
      },
      err => console.log(err)
    )
    return this.usuario$.asObservable();
  }

  estaLogueado(){
    return !!localStorage.getItem('token')  // comprobamos si existe el token para retornar true:false
  }

  getToken(){
    return localStorage.getItem('token')
  }

  logout(){
    localStorage.removeItem('token')
    localStorage.removeItem('id_us')
    localStorage.removeItem('correo_us')

    this.router.navigate(['/login'])
  }
  /*
  cambiarUsuario(message: string){
    this.messageSource.next(message)
  }*/
}
