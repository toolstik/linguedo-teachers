@requestMapping('auth')
class AuthResource {

    @requestMapping('login')
    login(data: {
        token: string;
    }) {
        return AuthService.login(data.token);
    }
    
}
