import {TeacherDto} from "./TeacherDto";
import {ClassTypeDto} from "./ClassTypeDto";
import {StudentDto} from "./StudentDto";

export class StudentTeacherDto {
    student: StudentDto;
    teacher: TeacherDto;
    classType: ClassTypeDto;
}