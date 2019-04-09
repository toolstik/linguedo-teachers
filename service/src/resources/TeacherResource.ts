import {preAuthorize, requestMapping} from "../main";
import {StudentTeacherService} from "../services/StudentTeacherService";
import {TeacherService} from "../services/TeacherService";
import {LessonDto} from "../../../shared/transfer/LessonDto";

@requestMapping('teacher')
class TeacherResource {

    @requestMapping('list')
    @preAuthorize(['staff', 'teacher'])
    getAll() {
        return new TeacherService().getAll();
    }

    @requestMapping('students')
    @preAuthorize(['teacher'])
    getStudents() {
        return new StudentTeacherService().getByCurrentTeacher();
    }

    @requestMapping('teachersForLesson')
    @preAuthorize(['teacher'])
    getTeachersForLesson(lesson: LessonDto) {
        return new TeacherService().getTeachersForLesson(lesson);
    }

}
