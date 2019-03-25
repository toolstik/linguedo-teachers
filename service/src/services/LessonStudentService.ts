import {Model} from "../Model";
import {LessonStudentDto} from "../../../shared/transfer/LessonStudentDto";

export class LessonStudentService {
    constructor(private model = new Model()) {
    }

    getStudentsByLessonId(lessonId: string) {
        return this.model.lessonStudent
            .find({lesson: lessonId, isActive: true})
            .map(s => {
                return {
                    ...s,
                    student: this.model.student.findOne({id: s.student})
                } as LessonStudentDto;
            });
    }
}