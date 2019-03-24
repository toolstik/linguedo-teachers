import {Model} from "../Model";
import {AuthService} from "./AuthService";
import {StudentDto} from "../../../shared/transfer/StudentDto";

export class StudentService {

    constructor(
        private model = new Model()
    ) {
    }

    getCurrent(): StudentDto {
        const user = AuthService.getCurrentUser();

        if (!user) return null;

        return this.model.student.findOne({id: user.id}) as StudentDto;
    }

}

