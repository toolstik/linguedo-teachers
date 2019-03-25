import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LessonDto} from "../../../../../shared/transfer/LessonDto";
import {EventObject} from "fullcalendar";
import {LessonService} from "../../_services/lesson.service";
import {ClassTypeService} from "../../_services/class-type.service";
import {ClassTypeDto} from "../../../../../shared/transfer/ClassTypeDto";
import {Observable} from "rxjs";
import {LessonStudentDto} from "../../../../../shared/transfer/LessonStudentDto";
import {StudentDto} from "../../../../../shared/transfer/StudentDto";

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

  classTypes: ClassTypeDto[];
  students: LessonStudentDto[];
  newStudent: StudentDto;

  constructor(private lessonService: LessonService,
              private classTypeService: ClassTypeService) {
  }

  ngOnInit() {
    this.newStudent = null;

    this.getClassTypes();
    this.getStudents();
  }

  getStudents() {
    this.lessonService.getStudents(this.selectedLesson.id)
      .subscribe(data => {
        this.students = data;
      })
  }

  getClassTypes() {
    this.classTypeService.getAll()
      .subscribe(data => {
        this.classTypes = data;
      })
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

  removeStudent(student: LessonStudentDto) {
    student.isActive = false;
  }

  restoreStudent(student: LessonStudentDto) {
    student.isActive = true;
  }

  createStudent() {
    this.newStudent = new StudentDto();
  }

  addStudent() {
    if (!this.newStudent)
      return;

    const lessonStudent: LessonStudentDto = {
      lesson: this.selectedLesson.id,
      student: this.newStudent,
      isActive: true,
      isVisited: true
    };

    this.students.push(lessonStudent);
    this.newStudent = null;
  }

  cancelAddStudent() {
    this.newStudent = null;
  }
}
