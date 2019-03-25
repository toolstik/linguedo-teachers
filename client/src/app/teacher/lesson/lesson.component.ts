import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LessonDto} from "../../../../../shared/transfer/LessonDto";
import {EventObject} from "fullcalendar";
import {LessonService} from "../../_services/lesson.service";
import {ClassTypeService} from "../../_services/class-type.service";
import {ClassTypeDto} from "../../../../../shared/transfer/ClassTypeDto";
import {Observable} from "rxjs";

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.css']
})
export class LessonComponent implements OnInit {

  @Input('event') selectedEvent: EventObject;
  @Input('lesson') selectedLesson: LessonDto;

  @Output() onSave = new EventEmitter();
  @Output() onCancel = new EventEmitter();

  classTypes$: Observable<ClassTypeDto[]>;

  constructor(private lessonService: LessonService,
              private classTypeService: ClassTypeService) {
  }

  ngOnInit() {
    this.classTypes$ = this.classTypeService.getAll();
  }

  save() {
    this.lessonService.saveTeacherLesson(this.selectedLesson)
      .subscribe(() => {
        this.onSave.next();
      });
  }

  cancel() {
    this.onCancel.next();
  }

}
