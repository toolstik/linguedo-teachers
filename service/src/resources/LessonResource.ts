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
        new LessonStudentService().saveMany(lesson.students);
        new LessonService().saveMyLesson(lesson.lesson);
    }

    @requestMapping('getStudents')
    @preAuthorize(['teacher', 'staff'])
    getStudents(lessonId: string) {
        return new LessonStudentService().getStudentsByLessonId(lessonId);
    }

}
