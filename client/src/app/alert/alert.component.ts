import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {AlertService} from "../_services/alert.service";

type Alert = { type: string, text: string };

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  alerts: Alert[];

  constructor(private alertService: AlertService) {
  }

  ngOnInit() {
    this.reset();

    this.subscription = this.alertService.getMessage()
      .subscribe(message => {
        this.alerts = [message];
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  close(alert: Alert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }

  reset() {
    this.alerts = [];
  }
}
