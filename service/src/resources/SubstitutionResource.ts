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

    @requestMapping('accept')
    @preAuthorize(['teacher'])
    accept(substitution: SubstitutionDto) {
        return new SubstitutionService().accept(substitution);
    }

    @requestMapping('decline')
    @preAuthorize(['teacher'])
    decline(substitution: SubstitutionDto) {
        return new SubstitutionService().decline(substitution);
    }

    @requestMapping('outgoing')
    @preAuthorize(['teacher'])
    outgoing() {
        return new SubstitutionService().getOutgoing();
    }

    @requestMapping('incoming')
    @preAuthorize(['teacher'])
    incoming() {
        return new SubstitutionService().getIncoming();
    }
}
