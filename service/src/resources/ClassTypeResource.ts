@requestMapping('classType')
class ClassTypeResource {

    @requestMapping('list')
    getAll() {
        return new Model().classType.findAll();
    }

}
