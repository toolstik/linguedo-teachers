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
