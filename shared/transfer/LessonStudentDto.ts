import { StudentDto } from './StudentDto';
export class LessonStudentDto {
    lesson: string;
    student: StudentDto;
    isVisited: boolean;
    isActive: boolean;
}
