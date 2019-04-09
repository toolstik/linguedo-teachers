import {AuthService} from '../../dist/main';
import {Model} from "../Model";
import {TeacherDto} from '../../../shared/transfer/TeacherDto';
import {LessonDto} from "../../../shared/transfer/LessonDto";
import {LessonService} from "./LessonService";
import {CalendarService} from "./CalendarService";
import {SubstitutionDto} from "../../../shared/transfer/SubstitutionDto";

export class SubstitutionService {


    constructor(
        private model = new Model(),
        private lessonService = new LessonService()
    ) {
    }

    private fillEntity = (s: SubstitutionDto) => {
        return {
            ...s,
            lesson: this.lessonService.getById(s.lesson as any),
            fromTeacher: this.model.teacher.findOne({id: s.fromTeacher}),
            toTeacher: this.model.teacher.findOne({id: s.toTeacher}),
        } as SubstitutionDto;
    };

    getAll() {
        return this.model.substitution.findAll()
            .map(this.fillEntity);
    }

    private save(substitution: SubstitutionDto) {
        let itemToSave =
            this.model.lesson.findOne({
                lesson: substitution.lesson.id,
                fromTeacher: substitution.fromTeacher.id,
                toTeacher: substitution.toTeacher.id,
            });

        if (!itemToSave) {
            itemToSave = {
                lesson: substitution.lesson.id,
                fromTeacher: substitution.fromTeacher.id,
                toTeacher: substitution.toTeacher.id,
            }
        }

        itemToSave.status = substitution.status;

        this.model.substitution.save(itemToSave);
    }

    selfRequested() {
        const user = AuthService.getCurrentUser();

        if (!user)
            return [];

        return this.model.substitution.find({fromTeacher: user.id})
            .map(this.fillEntity);
    }

    create(substitution: SubstitutionDto) {
        substitution.status = "PENDING";
        this.save(substitution);
    }

    accept(substitution: SubstitutionDto) {
        substitution.status = "ACCEPTED";
        this.save(substitution);
    }

    decline(substitution: SubstitutionDto) {
        substitution.status = "DECLINED";
        this.save(substitution);
    }

}

