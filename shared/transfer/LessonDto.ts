import { StudentDto } from './StudentDto';
import { TeacherDto } from "./TeacherDto";
import { ClassTypeDto } from "./ClassTypeDto";

export class LessonDto {
    id: string;
    startTime: Date;
    endTime: Date;
    teacher: TeacherDto;
    classType: ClassTypeDto;
    group: string;
}