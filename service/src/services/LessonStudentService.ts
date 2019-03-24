import {Model} from "../Model";
import {LessonStudentDto} from "../../../shared/transfer/LessonStudentDto";

export class LessonStudentService {
    constructor(private model = new Model()) {
    }

    getStudentsByLessonId(lessonId: string) {
        return this.model.lessonStudent.find({lesson: lessonId, isActive: true}) as LessonStudentDto[];
    }
}