import { UserDto } from './../../../shared/transfer/UserDto';
import { Model } from '../Model';
import { ServiceError } from '../ServiceError';

export class AuthService {

    private static currentUser: UserDto;

    static auth(token: string) {
        this.currentUser = this.getUserByToken(token);
    }

    static login(email:string, password: string) {
        const user = this.getUserById(email);

        if (!user)
            throw new ServiceError('forbidden', `User ${email} is not found. Please contact your system administrator`);

        if(password != user.password)
            throw new ServiceError('forbidden', `Invalid password`);

        return user;
    }

    private static getUserByToken(token: string) {
        if (!token)
            return null;

        const user = new Model().user.findOne({ token: token });
        return user as UserDto;
    }

    private static getUserById(email: string) {
        if (!email)
            return null;

        const user = new Model().user.findOne({ id: email });
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
