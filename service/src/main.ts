import { AuthService } from "./services/AuthService";
import { Resources } from "./Resources";

function doGet(e) {
    let responce: Responce;
    try {
        const result = execute(e);
        responce = {
            success: true,
            body: result
        }
    }
    catch (error) {
        responce = {
            success: false,
            error: error
        };

        console.error({
            user: getCurrentUserName(),
            error: error,
            parameters: e.parameter
        });
    }
    const resultString = JSON.stringify(responce);
    return ContentService.createTextOutput(e.parameter.callback + "(" + resultString + ");")
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function execute(e) {
    const request: Request = JSON.parse(e.parameter.request);
    return Resources.processRequest(request);
}

export function getCurrentUserName() {
    const user = AuthService.getCurrentUser();

    if (!user)
        return 'anonimous';

    return user.id;
}

export function preAuthorize(roles: string[]) {
    return function (target: Object, key: string) {

        // save a reference to the original method this way we keep the values currently in the
        // descriptor and don't overwrite what another decorator might have done to the descriptor.
        const descriptor = Object.getOwnPropertyDescriptor(target, key);

        var originalMethod = descriptor.value;

        function roleCheck(roles: string[]) {
            if (roles && roles.length) {
                const currentUser = AuthService.getCurrentUser();
                const currentRole = currentUser ? currentUser.role : null;

                if (!roles.some(r => r == currentRole)) {
                    throw new ServiceError(
                        'forbidden',
                        'You do not have enough permissions to perform that action',
                        {
                            actualRole: currentRole,
                            requiredRoles: roles,
                            request: Resources.getCurrentRequest()
                        }
                    );
                }
            }
        }

        //editing the descriptor/value parameter
        descriptor.value = function () {
            roleCheck(roles);
            // note usage of originalMethod here
            var result = originalMethod.apply(this, arguments);
            return result;
        };

        // bug fix
        Object.defineProperty(target, key, descriptor);

        // return edited descriptor as opposed to overwriting the descriptor
        return descriptor;
    }
}


export function requestMapping(name?: string) {
    return function (target: any, key?: string) {
        if (!key) {
            // class
            Resources.setResource(target, name);
            return target;
        }
        else {
            // method
            Resources.setMethod(target, key, name)
        }
    }
}
