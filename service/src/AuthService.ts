class AuthService {

    private static currentUser: UserEntity;

    static authenticate(token: string) {
        if (!token)
            throw new ServiceError('forbidden', 'Access token is not specified');

        const user = new Model().user.findOne({ token: token });

        if (!user)
            throw new ServiceError('forbidden', 'Access token is invalid or expired');

        AuthService.currentUser = user as UserEntity;

        return user;
    }

    static getCurrentUser() {
        return AuthService.currentUser;
    }

}
