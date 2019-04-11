import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {CalendarComponent} from './calendar/calendar.component';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {FullCalendarModule} from 'ng-fullcalendar';
import {TeacherComponent} from './teacher/teacher.component';
import {HttpClientJsonpModule, HttpClientModule} from "@angular/common/http";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {CheckboxComponent} from './common/checkbox/checkbox.component';
import {LoginComponent} from './login/login.component';
import {TimepickerComponent} from './common/timepicker/timepicker.component';
import {ConfirmWindowComponent} from "./common/confirm-window/confirm-window.component";
import { LessonComponent } from './teacher/lesson/lesson.component';
import { LoadingComponent } from './common/loading/loading.component';
import { DropdownComponent } from './common/dropdown/dropdown.component';
import { DatepickerRangeComponent } from './common/datepicker-range/datepicker-range.component';
import { AlertComponent } from './alert/alert.component';
import { DatepickerMultipleComponent } from './common/datepicker-multiple/datepicker-multiple.component';
import { WindowComponent } from './common/window/window.component';
import { InvoiceComponent } from './teacher/invoice/invoice.component';

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    TeacherComponent,
    CheckboxComponent,
    LoginComponent,
    TimepickerComponent,
    ConfirmWindowComponent,
    LessonComponent,
    LoadingComponent,
    DropdownComponent,
    DatepickerRangeComponent,
    AlertComponent,
    DatepickerMultipleComponent,
    WindowComponent,
    InvoiceComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientJsonpModule,
    HttpClientModule,
    FullCalendarModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
