import {TeacherService} from './TeacherService';
import {LessonDto} from './../../../shared/transfer/LessonDto';
import {Model} from '../Model';
import {getCurrentUserName} from '../main';
import {CalendarService} from './CalendarService';

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

    saveMyLesson(lesson: LessonDto) {
        lesson.teacher = this.teacherService.getCurrent();
        lesson.startTime = new Date(lesson.startTime);
        lesson.endTime = new Date(lesson.endTime);

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
        this.model.lesson.commit();

        return lesson;
    }
}


