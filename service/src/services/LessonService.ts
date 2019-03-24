import { LessonEntity } from './../../../shared/transfer/LessonEntity';
import { Model } from '../Model';
import { getCurrentUserName } from '../main';

export class LessonService {
    private model: Model;

    constructor() {
        this.model = new Model();
    }

    fillEntity = (l: any) => {
        return {
            ...l,
            teacher: this.model.teacher.findOne({ id: l.teacher }),
            classType: this.model.classType.findOne({ id: l.classType }),
            students: this.model.lessonStudents
                .find({ lesson: l.id })
                .map(s => this.model.student.findOne({ id: s.student }))
        }
    }

    getAll() {
        return this.model.lesson.findAll()
            .map(this.fillEntity);
    }

    getByTeacher(teacher: string) {
        return this.model.lesson.find({ teacher: teacher })
            .map(this.fillEntity);
    }

    getByCurrentTeacher(){
        return this.getByTeacher(getCurrentUserName());
    }
}
