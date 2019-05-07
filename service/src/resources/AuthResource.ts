import { AuthService } from "../services/AuthService";
import { requestMapping } from "../main";

@requestMapping('auth')
class AuthResource {

    @requestMapping('login')
    login(data: {
        email: string;
        password: string;
    }) {
        const user = AuthService.login(data.email, data.password);
        delete user["password"];
        return user;
    }
    
}
