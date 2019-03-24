import { Model } from "../Model";
import { requestMapping } from "../main";

@requestMapping('teacher')
class TeacherResource {

    @requestMapping('list')
    getAll() {
        return new Model().teacher.findAll();
    }

}
