import {Injectable} from '@angular/core';
import {MyJsonpService} from "./my-jsonp.service";
import {ReplaySubject} from "rxjs";
import {SubstitutionDto} from "../../../../shared/transfer/SubstitutionDto";

@Injectable({
  providedIn: 'root'
})
export class SubstitutionService {

  private resource = 'substitution';

  constructor(private jsonp: MyJsonpService) {
  }

  getAll() {
    const subj = new ReplaySubject<SubstitutionDto[]>(1);

    this.jsonp.exec(this.resource, 'list')
      .subscribe(subj);

    return subj.asObservable();
  }

  create(sub: SubstitutionDto) {
    return this.jsonp.exec(this.resource, 'create', sub);
  }

  getOutgoing() {
    return this.jsonp.exec<SubstitutionDto[]>(this.resource, 'outgoing');
  }

  getIncoming() {
    return this.jsonp.exec<SubstitutionDto[]>(this.resource, 'incoming');
  }

  accept(sub:SubstitutionDto){
    return this.jsonp.exec(this.resource, 'accept', sub);
  }

  decline(sub:SubstitutionDto){
    return this.jsonp.exec(this.resource, 'decline', sub);
  }
}
