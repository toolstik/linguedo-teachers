import {Model} from "../Model";
import {LessonStudentDto} from "../../../shared/transfer/LessonStudentDto";

export class LessonStudentService {
    constructor(private model = new Model()) {
    }

    private proj = s => {
        return {
            ...s,
            student: this.model.student.findOne({id: s.student})
        } as LessonStudentDto;
    };

    getStudentsByLessonId(lessonId: string) {
        return this.model.lessonStudent
            .find({lesson: lessonId, isActive: true})
            .map(this.proj);
    }

    saveMany(students: LessonStudentDto[]) {

        for (let item of students) {
            let existing = this.model.lessonStudent
                // todo multi-column index required
                .findOne({
                    lesson: item.lesson,
                    student: item.student.id
                }) as LessonStudentDto;

            if (existing) {
                existing.isVisited = item.isVisited;
                existing.isActive = item.isActive;

                this.model.lessonStudent.save(existing);
            } else {
                const newItem = {
                    lesson: item.lesson,
                    student: item.student.id,
                    isActive: item.isActive,
                    isVisited: item.isVisited
                };

                this.model.lessonStudent.save(newItem);
            }
        }
    }
}

