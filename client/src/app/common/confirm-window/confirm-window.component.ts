import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {WindowComponent} from "../window/window.component";

@Component({
  selector: 'confirm-window',
  templateUrl: './confirm-window.component.html',
  styleUrls: ['./confirm-window.component.css']
})
export class ConfirmWindowComponent implements OnInit {

  @ViewChild('myWindow') private myWindow: WindowComponent;

  @Output() onOk = new EventEmitter();
  @Output() onCancel = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  open() {
    this.myWindow.open();
  }

  ok() {
    this.onOk.next();
    this.myWindow.close('OK');
  }

  cancel() {
    this.onCancel.next();
    this.myWindow.close('CANCEL');
  }

}
