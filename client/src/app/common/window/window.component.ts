import {Component, EventEmitter, OnDestroy, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'myWindow',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.css']
})
export class WindowComponent implements OnInit, OnDestroy {

  @ViewChild('myWindow') private myWindow: TemplateRef<any>;

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
}
