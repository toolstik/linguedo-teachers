import { AuthService } from "../services/AuthService";
import { requestMapping } from "../main";

@requestMapping('auth')
class AuthResource {

    @requestMapping('login')
    login(data: {
        token: string;
    }) {
        return AuthService.login(data.token);
    }
    
}
