import {TeacherService} from './TeacherService';
import {LessonDto} from '../../../shared/transfer/LessonDto';
import {Model} from '../Model';
import {clone, getCurrentUserName} from '../main';
import {CalendarService} from './CalendarService';
import {LessonStudentDto} from "../../../shared/transfer/LessonStudentDto";
import {LessonStudentService} from "./LessonStudentService";

export class LessonService {


    constructor(
        private model = new Model(),
        private calendarService = new CalendarService(),
        private teacherService = new TeacherService()
    ) {
    }

    fillEntity = (l: any) => {
        return {
            ...l,
            teacher: this.model.teacher.findOne({id: l.teacher}),
            classType: this.model.classType.findOne({id: l.classType}),
            // students: this.model.lessonStudent
            //     .find({ lesson: l.id })
            //     .map(s => this.model.student.findOne({ id: s.student }))
        }
    };

    getAll() {
        return this.model.lesson.findAll()
            .map(this.fillEntity);
    }

    getByTeacher(teacher: string) {
        return this.model.lesson.find({teacher: teacher})
            .map(this.fillEntity);
    }

    getByCurrentTeacher() {
        return this.getByTeacher(getCurrentUserName());
    }

    saveTeacherLesson(lesson: LessonDto, students?: LessonStudentDto[]) {
        lesson.teacher = this.teacherService.getCurrent();
        lesson.startTime = new Date(lesson.startTime);
        lesson.endTime = new Date(lesson.startTime);
        lesson.endTime.setHours(
            lesson.startTime.getHours(),
            lesson.startTime.getMinutes() + lesson.classType.duration
        );

        let lessonToSave =
            lesson.id
                ? this.model.lesson.findOne({id: lesson.id})
                : {};

        lessonToSave.startTime = lesson.startTime;
        lessonToSave.endTime = lesson.endTime;

        lessonToSave.teacher = lesson.teacher.id;
        lessonToSave.classType = lesson.classType.id;
        lessonToSave.group = lesson.group;

        this.calendarService.saveLesson(lesson);

        lessonToSave.id = lesson.id;

        this.model.lesson.save(lessonToSave);

        if (students) {
            for (let i of students)
                i.lesson = lesson.id;

            new LessonStudentService().saveMany(students);
        }

        return lesson;
    }

    private changeDate(date: Date | string, newDate: Date | string) {
        date = new Date(date);
        newDate = new Date(newDate);
        date.setFullYear(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
        return date;
    }

    cloneTeacherLesson(lesson: LessonDto, students: LessonStudentDto[], dates: Date[]) {

        const newStudents = clone(students)
            .filter(s => s.isActive)
            .map(s => {
                s.isVisited = true;
                return s;
            });


        for (let d of dates) {
            const newLesson: LessonDto = {
                ...lesson,
                id: null,
                startTime: this.changeDate(lesson.startTime, d),
                endTime: this.changeDate(lesson.endTime, d),
            };

            this.saveTeacherLesson(newLesson, newStudents);
        }
    }
}


