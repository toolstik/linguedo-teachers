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
    ) {
    }

    getAll() {
        return this.model.substitution.findAll() as SubstitutionDto[];
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

