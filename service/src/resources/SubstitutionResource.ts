import {preAuthorize, requestMapping} from "../main";
import {SubstitutionDto} from "../../../shared/transfer/SubstitutionDto";
import {SubstitutionService} from "../services/SubstitutionService";

@requestMapping('substitution')
class SubstitutionResource {

    @requestMapping('list')
    @preAuthorize(['staff', 'teacher'])
    getAll() {
        return new SubstitutionService().getAll();
    }

    @requestMapping('create')
    @preAuthorize(['staff', 'teacher'])
    create(substitution: SubstitutionDto) {
        return new SubstitutionService().create(substitution);
    }
}
