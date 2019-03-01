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

    get teacher() {
        return this.model.getRepository('teacher');
    }
}

class CalendarService {

    private calendar: GoogleAppsScript.Calendar.Calendar;

    constructor() {
        this.calendar = CalendarApp.getCalendarById('eb5h7032lf7oddtg2oelgd4m94@group.calendar.google.com');

        //  var event = cal.createEvent("My event",
        //                              new Date('February 20, 2019 20:00:00 UTC'),
        //                              new Date('February 21, 2019 21:00:00 UTC'));
        //
        // new Date()

        // var event1 = cal.getEventById("kpspv68gmgn22uvoid82jlfp8s@google.com");
    }

    getEvents() {
        const start = new Date(Date.parse("2019-01-01T00:00:00"));
        const end = new Date(Date.parse("2019-03-01T00:00:00"));
        const events = this.calendar.getEvents(start, end);
        return events;
    }
}

class Resources {

    testMeth(i) {
        // i['hello'] = new Model().teacher.findAll();
        i['hello'] = new CalendarService().getEvents()
            .map(e => ({
                title: e.getTitle(),
                start: e.getStartTime(),
                end: e.getEndTime()

            }));
        return i;
    }
}
