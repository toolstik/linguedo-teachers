import {preAuthorize, requestMapping} from "../main";
import {StudentTeacherService} from "../services/StudentTeacherService";
import {TeacherService} from "../services/TeacherService";

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

}
