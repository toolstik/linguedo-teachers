@requestMapping('student')
class StudentResource {

    @requestMapping('list')
    getAll() {
        return new Model().student.findAll();
    }

}
