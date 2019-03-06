import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CalendarComponent as FullCalendarComponent} from 'ng-fullcalendar';
import {EventObject, Options} from 'fullcalendar';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  calendarOptions: Options;

  @ViewChild(FullCalendarComponent) ucCalendar: FullCalendarComponent;

  @Input() events: any[];
  @Output() eventSelected = new EventEmitter<EventObject>();

  constructor() {
  }

  ngOnInit() {
    this.calendarOptions = {
      editable: false,
      eventLimit: false,
      weekNumberCalculation:'ISO',
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay,listMonth'
      },
      events: []
    };
  }

  eventClick(e: EventObject) {
    this.eventSelected.next(e);
  }
}
