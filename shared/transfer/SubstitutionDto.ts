import {LessonDto} from "./LessonDto";
import {TeacherDto} from "./TeacherDto";

export type SubstitutionStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED';

export class SubstitutionDto {
    lesson: LessonDto;
    fromTeacher: TeacherDto;
    toTeacher: TeacherDto;
    status: SubstitutionStatus;
}


