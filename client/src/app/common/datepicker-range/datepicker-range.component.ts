import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {NgbCalendar, NgbDate, NgbDatepicker} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'myDatepickerRange',
  templateUrl: './datepicker-range.component.html',
  styleUrls: ['./datepicker-range.component.css']
})
export class DatepickerRangeComponent {

  @ViewChild('dp') datePicker: NgbDatepicker;

  @Output() onRangeSelected = new EventEmitter();

  hoveredDate: NgbDate;

  fromDate: NgbDate;
  toDate: NgbDate;

  constructor(calendar: NgbCalendar) {
    // this.fromDate = calendar.getToday();
    // this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
      this.onRangeSelected.next({
        fromDate: new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day),
        toDate: new Date(this.toDate.year, this.toDate.month - 1, this.toDate.day)
      });
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }

}
