@requestMapping('calendar')
class CalendarResource {

    @requestMapping('list')
    getAll() {
        return new CalendarService().getAll();
    }

}
