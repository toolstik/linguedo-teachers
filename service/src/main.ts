function doGet(e) {
    const result = execute(e);
    const resultString = JSON.stringify(result);
    return ContentService.createTextOutput(e.parameter.callback + "(" + resultString + ");")
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function execute(e) {
    const resources = new Resources();
    const body = e.parameter.body != null ? JSON.parse(e.parameter.body) : null;
    return resources[e.parameter.method](body);
}

class Resources {
    testMeth(i) {
        return i;
    }
}
