import {Injectable} from '@angular/core';
import {MyJsonpService} from "./my-jsonp.service";
import {ClientDto} from "../_transfer/ClientDto";
import {ReplaySubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ClientService {



  constructor(private jsonp: MyJsonpService) {
  }

  getAll() {
    const subj = new ReplaySubject<ClientDto[]>(1);

    this.jsonp.exec('getAllClients')
      .subscribe(subj);

    return subj.asObservable();
  }
}
