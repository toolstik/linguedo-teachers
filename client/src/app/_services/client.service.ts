import {Injectable} from '@angular/core';
import {MyJsonpService} from "./my-jsonp.service";
import {ClientDto} from "../_transfer/ClientDto";

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private jsonp: MyJsonpService) {
  }

  getAll() {
    return this.jsonp.exec<ClientDto>('getAllClients');
  }
}
