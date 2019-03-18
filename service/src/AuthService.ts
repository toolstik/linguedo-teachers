class AuthService {

    private users = new Model().user;

    login(token: string) {
        const user = this.users.findOne({ token: token });

        if (!user)
            throw new ServiceError('forbidden', 'Access token is invalid or expired');

        return user;
    }

}
