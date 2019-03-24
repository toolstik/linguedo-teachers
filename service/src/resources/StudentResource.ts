import { Model } from "../Model";
import { requestMapping } from "../main";

@requestMapping('student')
class StudentResource {

    @requestMapping('list')
    getAll() {
        return new Model().student.findAll();
    }

}
