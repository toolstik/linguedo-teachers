@requestMapping('client')
class ClientResource {

    @requestMapping('list')
    getAll() {
        return new Model().client.findAll();
    }

}
