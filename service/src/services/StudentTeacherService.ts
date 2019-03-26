import {Model} from "../Model";
import {StudentTeacherDto} from "../../../shared/transfer/StudentTeacherDto";
import {TeacherService} from "./TeacherService";

export class StudentTeacherService {
    constructor(private model = new Model(),
                private teacherService = new TeacherService()) {
    }

    private proj = (s: any) => {
        return {
            student: this.model.student.findOne({id: s.student}),
            teacher: this.model.teacher.findOne({id: s.teacher}),
            classType: this.model.classType.findOne({id: s.classType})
        } as StudentTeacherDto;
    }

    getByCurrentTeacher() {
        const currentTeacher = this.teacherService.getCurrent();

        if (!currentTeacher)
            return [];

        return this.getByTeacher(currentTeacher.id);
    }

    getByTeacher(teacherId: string) {
        return this.model.studentTeacher
            .find({teacher: teacherId})
            .map(this.proj);
    }

    getByTeacherAndClassType(teacherId: string, classType: string) {
        return this.model.studentTeacher
            .find({teacher: teacherId, classType: classType})
            .map(this.proj);
    }
}