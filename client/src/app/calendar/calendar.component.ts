import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit, Input
} from '@angular/core';
import {Subject} from 'rxjs';
import {CalendarComponent as FullCalendarComponent} from 'ng-fullcalendar';
import {Options} from 'fullcalendar';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  calendarOptions: Options;

  @ViewChild(FullCalendarComponent) ucCalendar: FullCalendarComponent;

  @Input('events') events: any[];

  constructor() {
  }

  ngOnInit() {
    this.calendarOptions = {
      editable: false,
      eventLimit: false,
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay,listMonth'
      },
      events: []
      //   [
      //   {
      //     title: 'Title',
      //     start: '2019-02-20T09:00',
      //     end: '2019-02-20T12:00'
      //   }
      // ]
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
