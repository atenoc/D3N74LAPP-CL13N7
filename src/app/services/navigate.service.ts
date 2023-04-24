import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigateService {

  private messageSource = new BehaviorSubject<string>('') 
  mensajeActual = this.messageSource.asObservable()

  private data = new BehaviorSubject<boolean>(true);

  constructor() { }

  cambiarMensaje(message: string){
    this.messageSource.next(message)
  }


  setData(data: boolean) {
    this.data.next(data);
  }

  getData() {
    return this.data.asObservable();
  }
}
