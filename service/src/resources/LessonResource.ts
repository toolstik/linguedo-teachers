import {LessonDto} from './../../../shared/transfer/LessonDto';
import {LessonService} from "../services/LessonService";
import {requestMapping, preAuthorize} from "../main";
import {LessonStudentService} from "../services/LessonStudentService";
import {LessonStudentDto} from "../../../shared/transfer/LessonStudentDto";

@requestMapping('lesson')
class LessonResource {

    @requestMapping('list')
    @preAuthorize(['staff'])
    getAll() {
        return new LessonService().getAll();
    }

    @requestMapping('byCurrentTeacher')
    @preAuthorize(['teacher'])
    getByCurrentTeacher() {
        return new LessonService().getByCurrentTeacher();
    }

    @requestMapping('save')
    @preAuthorize(['teacher'])
    saveTeacherLesson(lesson: { lesson: LessonDto; students: LessonStudentDto[] }) {
        lesson.lesson = new LessonService().saveTeacherLesson(lesson.lesson);

        for (let i of lesson.students)
            i.lesson = lesson.lesson.id;

        new LessonStudentService().saveMany(lesson.students);
    }

    @requestMapping('clone')
    @preAuthorize(['teacher'])
    cloneTeacherLesson(lesson: { lesson: LessonDto; students: LessonStudentDto[]; dates: Date[] }) {
        new LessonService().cloneTeacherLesson(lesson.lesson, lesson.students, lesson.dates);
    }

    @requestMapping('getStudents')
    @preAuthorize(['teacher', 'staff'])
    getStudents(lessonId: string) {
        return new LessonStudentService().getStudentsByLessonId(lessonId);
    }

}
