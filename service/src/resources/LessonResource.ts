import {LessonDto} from './../../../shared/transfer/LessonDto';
import {LessonService} from "../services/LessonService";
import {requestMapping, preAuthorize} from "../main";
import {LessonStudentService} from "../services/LessonStudentService";

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
    saveTeacherLesson(lesson: LessonDto) {
        new LessonService().saveMyLesson(lesson);
    }

    @requestMapping('getStudents')
    @preAuthorize(['teacher', 'staff'])
    getStudents(lessonId: string) {
        return new LessonStudentService().getStudentsByLessonId(lessonId);
    }

}
