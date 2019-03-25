import {Component, EventEmitter, OnDestroy, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'confirm-window',
  templateUrl: './confirm-window.component.html',
  styleUrls: ['./confirm-window.component.css']
})
export class ConfirmWindowComponent implements OnInit, OnDestroy {

  @ViewChild('myWindow') myWindow: TemplateRef<any>;

  @Output() onOk = new EventEmitter();
  @Output() onCancel = new EventEmitter();

  private modalRef: NgbModalRef;

  constructor(private modalService: NgbModal) {
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.modalService.dismissAll();
  }

  open() {
    this.modalRef = this.modalService.open(this.myWindow, {centered: true});
  }

  close(reason?) {
    if (this.modalRef)
      this.modalRef.close(reason);
  }

  ok() {
    this.onOk.next();
    this.close('OK');
  }

  cancel() {
    this.onCancel.next();
    this.close('CANCEL');
  }

}
