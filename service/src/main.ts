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

console.log(roles);
console.log(currentUser);
console.log(currentRole);

        if (!roles.some(r => r == currentRole))
            throw new ServiceError('forbidden', 'You do not have enough permissions to perform that action');
    }
}
