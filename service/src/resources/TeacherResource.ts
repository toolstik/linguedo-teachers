@requestMapping('teacher')
class TeacherResource {

    @requestMapping('list')
    getAll() {
        return new Model().teacher.findAll();
    }

}
