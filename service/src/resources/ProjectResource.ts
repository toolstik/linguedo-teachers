import { Model } from "../Model";
import { requestMapping } from "../main";

@requestMapping('project')
export class ProjectResource {

    @requestMapping('list')
    getAll() {
        return new Model().project.findAll();
    }

}
