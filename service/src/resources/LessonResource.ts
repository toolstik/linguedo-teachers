import { LessonService } from "../services/LessonService";
import { requestMapping, preAuthorize } from "../main";

@requestMapping('lesson')
class LessonResource {

    @requestMapping('list')
    @preAuthorize(['staff'])
    getAll() {
        return new LessonService().getAll();
    }

    @requestMapping('byCurrentTeacher')
    @preAuthorize(['teacher'])
    getByCurrentTeacher() {
        return new LessonService().getByCurrentTeacher();
    }

}
