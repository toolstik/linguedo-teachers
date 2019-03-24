import {Component, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {NgbTimeStruct} from "@ng-bootstrap/ng-bootstrap";
import {Moment, isMoment} from "moment";

@Component({
  selector: 'myTimePicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TimepickerComponent),
    multi: true
  }]
})
export class TimepickerComponent implements ControlValueAccessor {

  private dateValue: Date | Moment;
  timeValue: NgbTimeStruct;

  private onChangeCallback: (_: any) => void = (() => {
  });

  constructor() {

  }

  getTime(): NgbTimeStruct {
    if (!this.dateValue)
      return null;

    if (this.dateValue instanceof Date)
      return {
        hour: this.dateValue.getHours(),
        minute: this.dateValue.getMinutes(),
        second: this.dateValue.getSeconds()
      };
    else if (isMoment(this.dateValue)) {
      return {
        hour: this.dateValue.hour(),
        minute: this.dateValue.minute(),
        second: this.dateValue.second()
      };
    }
  }

  setTime(time: NgbTimeStruct) {
    this.timeValue = time;

    if (!this.dateValue)
      return;

    if (this.dateValue instanceof Date)
      this.dateValue.setHours(time.hour, time.minute, time.second || 0, 0);
    else if (isMoment(this.dateValue)) {
      this.dateValue.hour(time.hour);
      this.dateValue.minute(time.minute);
      this.dateValue.second(time.second);
      this.dateValue.millisecond(0);
    }

    this.onChangeCallback(this.dateValue);
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  writeValue(obj: Date | Moment): void {
    if (typeof obj == 'string' || typeof obj == 'number')
      this.dateValue = new Date(obj);
    else
      this.dateValue = obj;
    this.timeValue = this.getTime();
  }

  registerOnTouched(fn: any): void {
  }


}
