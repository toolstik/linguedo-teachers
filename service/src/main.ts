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

class Model {

    private model: EntitySession;

    constructor() {
        const spreadsheet = SpreadsheetApp.openById('1W3fLlLxMWJJFa4qZ8iJ4JMkYtUKem2VWknlIm6-UKcg');

        this.model = new EntitySession({
            entities: {
                teacher: {
                    sheet: spreadsheet.getSheetByName("teacher")
                }
            }
        });
    }

    get teacher(){
        return this.model.getRepository('teacher');
    }
}

class Resources {

    testMeth(i) {
        i['hello'] = new Model().teacher.findAll();
        return i;
    }
}
