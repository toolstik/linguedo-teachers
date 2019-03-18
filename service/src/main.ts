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

    if (!request || !request.method)
        return {
            name: 'linguedo-teachers-service',
            date: new Date()
        };

    const resources = new Resources();
    return resources[request.method](request.body);
}
