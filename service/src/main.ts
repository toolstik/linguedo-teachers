function doGet(e) {
    let responce: Responce;
    try {
        const result = execute(e);
        responce = {
            success: true,
            body: result
        }
    }
    catch (e) {
        responce = {
            success: false,
            error: e
        }
    }
    const resultString = JSON.stringify(responce);
    return ContentService.createTextOutput(e.parameter.callback + "(" + resultString + ");")
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function execute(e) {
    const request: Request = JSON.parse(e.parameter.request);
    return new Resources().processRequest(request);
}

function roleCheck(roles: string[]) {
    if (roles && roles.length) {
        const currentUser = AuthService.getCurrentUser();
        const currentRole = currentUser ? currentUser.role : null;

        if (!roles.some(r => r == currentRole))
            throw new ServiceError('forbidden', 'You do not have enough permissions to perform that action');
    }
}

function preAuthorize(roles: string[]) {
    return function (target: Object, key: string) {

        // save a reference to the original method this way we keep the values currently in the
        // descriptor and don't overwrite what another decorator might have done to the descriptor.
        const descriptor = Object.getOwnPropertyDescriptor(target, key);

        var originalMethod = descriptor.value;

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

function requestMappingClass(name?: string) {
    return function (target: any) {
        Resources.setResource(target, name);
        return target;
    }
}

function requestMappingMethod(name?: string) {
    return function (target: any, key: string) {
        Resources.setMethod(target, key, name)
    }
}
