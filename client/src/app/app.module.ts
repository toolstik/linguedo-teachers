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
import { CheckboxComponent } from './common/checkbox/checkbox.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    TeacherComponent,
    CheckboxComponent,
    LoginComponent
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
