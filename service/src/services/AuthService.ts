import { UserDto } from './../../../shared/transfer/UserDto';
import { Model } from '../Model';
import { ServiceError } from '../ServiceError';

export class AuthService {

    private static currentUser: UserDto;

    static auth(token: string) {
        this.currentUser = this.getUserByToken(token);
    }

    static login(token: string) {
        const user = this.getUserByToken(token);

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
        return this.currentUser;
    }

    private static isRole(role: string) {
        const user = this.getCurrentUser();
        if (!user) return false;
        return user.role == role;
    }

    static isTeacher() {
        return this.isRole('teacher');
    }

    static isStudent() {
        return this.isRole('student');
    }

    static isStaff() {
        return this.isRole('staff');
    }

}
