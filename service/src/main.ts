function doGet(e) {
    const result = execute(e);
    const resultString = JSON.stringify(result);
    return ContentService.createTextOutput(e.parameter.callback + "(" + resultString + ");")
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function execute(e) {
    const resources = new Resources();

    if (!e.parameter.method)
        return {
            name: 'linguedo-teachers-service',
            date: new Date()
        };

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

    private mapEvent(e: GoogleAppsScript.Calendar.CalendarEvent) {
        return {
            id: e.getId(),
            title: e.getTitle(),
            description: e.getDescription(),
            start: e.getStartTime(),
            end: e.getEndTime()

        };
    }

    private mapMany(events: GoogleAppsScript.Calendar.CalendarEvent[]) {
        return events.map(this.mapEvent);
    }

    getAll() {
        const start = new Date(Date.parse("2019-01-01T00:00:00"));
        const end = new Date(Date.parse("2020-01-01T00:00:00"));
        const events = this.calendar.getEvents(start, end);
        return this.mapMany(events);
    }
}

class Resources {

    getAllTeachers() {
        return new Model().teacher.findAll();
    }

    getAllLessons() {
        return new CalendarService().getAll();
    }
}
