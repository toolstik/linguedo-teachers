import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'myDropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DropdownComponent),
    multi: true
  }]
})
export class DropdownComponent<T> implements ControlValueAccessor {

  constructor() {
    this.displayFunc = x => x.toString();
  }

  @Input() source: T[];
  @Input() displayFunc: (x: T) => string;
  @Input() placeHolder: string = 'Select Value';

  internalValue: any;

  private onChangeCallback: (_: any) => void = (() => {
  });

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
  }

  writeValue(obj: T): void {
    this.internalValue = obj;
  }

  setValue(newValue: T){
    this.internalValue = newValue;
    this.onChangeCallback(newValue);
  }

}
