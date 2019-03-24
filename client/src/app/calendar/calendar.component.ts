import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CalendarComponent as FullCalendarComponent} from 'ng-fullcalendar';
import {EventObject, Options} from 'fullcalendar';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, AfterViewInit {

  calendarOptions: Options;

  @ViewChild(FullCalendarComponent) ucCalendar: FullCalendarComponent;

  @Input() events: any[];
  @Output() eventSelected = new EventEmitter<EventObject>();
  @Output() onSelect = new EventEmitter<any>();

  constructor() {

  }

  ngOnInit() {
    this.calendarOptions = {
      editable: false,
      eventLimit: false,
      selectable: true,
      height: () => window.innerHeight * 0.8, // todo crap
      weekNumberCalculation: 'ISO',
      businessHours: {
        // days of week. an array of zero-based day of week integers (0=Sunday)
        dow: [1, 2, 3, 4, 5], // Monday - Friday

        start: '9:00', // a start time (9am in this example)
        end: '18:00', // an end time (6pm in this example)
      },
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay,listMonth'
      }
    };
  }

  ngAfterViewInit(): void {

  }

  eventClick(e: EventObject) {
    this.eventSelected.next(e);
  }
}
