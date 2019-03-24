import { Model } from "../Model";
import { requestMapping } from "../main";

@requestMapping('project')
class ProjectResource {

    @requestMapping('list')
    getAll() {
        return new Model().project.findAll();
    }

}
