import { ProjectDto } from "./ProjectDto";
import { TeacherDto } from "./TeacherDto";

export class StudentDto {
  id: string;
  firstName: string;
  lastName: string;
  skypeId: string;
  project: ProjectDto;
  teacher: TeacherDto;
}

