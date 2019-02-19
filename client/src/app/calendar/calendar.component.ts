import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit
} from '@angular/core';
import { Subject } from 'rxjs';
import { CalendarComponent as FullCalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {

  calendarOptions: Options;

  @ViewChild(FullCalendarComponent) ucCalendar: FullCalendarComponent;

  constructor() { }

  ngOnInit() {
    this.calendarOptions = {
      editable: true,
      eventLimit: false,
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay,listMonth'
      },
      events: []
    };
  }

  // clearEvents() {
  //   this.events = [];
  // }

  // loadEvents() {
  //   this.eventService.getEvents().subscribe(data => {
  //     this.events = data;
  //   });
  // }
}
