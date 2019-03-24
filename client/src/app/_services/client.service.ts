import {Injectable} from '@angular/core';
import {MyJsonpService} from "./my-jsonp.service";
import {ClientDto} from "../../../../shared/transfer/ClientDto";
import {ReplaySubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private resource = 'client';

  constructor(private jsonp: MyJsonpService) {
  }

  getAll() {
    const subj = new ReplaySubject<ClientDto[]>(1);

    this.jsonp.exec(this.resource, 'list')
      .subscribe(subj);

    return subj.asObservable();
  }
}
