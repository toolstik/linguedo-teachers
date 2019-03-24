import { AuthService } from '../../dist/main';
import { Model } from "../Model";
import { TeacherDto } from '../../../shared/transfer/TeacherDto';

export class TeacherService {

    constructor(
        private model = new Model()
    ) {
    }

    getCurrent(): TeacherDto {
        const user = AuthService.getCurrentUser();

        if (!user) return null;

        return this.model.teacher.findOne({ id: user.id }) as TeacherDto;
    }

}

