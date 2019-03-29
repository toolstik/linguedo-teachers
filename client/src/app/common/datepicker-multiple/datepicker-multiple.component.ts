import {Component, ViewChild} from '@angular/core';
import {NgbCalendar, NgbDate, NgbDatepicker} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'myDatepickerMultiple',
  templateUrl: './datepicker-multiple.component.html',
  styleUrls: ['./datepicker-multiple.component.css']
})
export class DatepickerMultipleComponent {

  @ViewChild('dp') datePicker: NgbDatepicker;

  hoveredDate: NgbDate;

  private dates: NgbDate[] = [];

  constructor(calendar: NgbCalendar) {
    // this.fromDate = calendar.getToday();
    // this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }

  get selectedDates() {
    return this.dates
      .sort((a, b) => a.before(b) ? -1 : 1)
      .map(d => new Date(d.year, d.month - 1, d.day));
  }

  onDateSelection(date: NgbDate) {
    this.toggleDate(date);
  }

  private toggleDate(date: NgbDate) {
    const existingIndex = this.dates.findIndex(d => d.equals(date));

    if (existingIndex >= 0)
      this.dates.splice(existingIndex, 1);
    else
      this.dates.push(date);
  }


  isHovered(date: NgbDate) {
    return false;
  }

  isInside(date: NgbDate) {
    return false;
  }

  isRange(date: NgbDate) {
    // return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
    return this.dates.some(d => d.equals(date));
  }

}
