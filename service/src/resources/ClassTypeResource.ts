import { Model } from "../Model";
import { requestMapping } from "../main";

@requestMapping('classType')
class ClassTypeResource {

    @requestMapping('list')
    getAll() {
        return new Model().classType.findAll();
    }

}
