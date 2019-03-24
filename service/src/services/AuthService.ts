import { UserDto } from './../../../shared/transfer/UserDto';
import { Model } from '../Model';

export class AuthService {

    private static currentUser: UserDto;

    static auth(token: string) {
        AuthService.currentUser = AuthService.getUserByToken(token);
    }

    static login(token: string) {
        const user = AuthService.getUserByToken(token);

        if (!user)
            throw new ServiceError('forbidden', 'Access token is invalid or expired');

        return user;
    }

    private static getUserByToken(token: string) {
        if (!token)
            return null;

        const user = new Model().user.findOne({ token: token });
        return user as UserDto;
    }

    static getCurrentUser() {
        return AuthService.currentUser;
    }

}
