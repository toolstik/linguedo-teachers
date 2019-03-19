class Resources {

    private static resources: any = {};
    private static methods: any = {};

    static setResource(constructor: Function, name?: string) {

        const resourceName = name || constructor.name;

        Resources.resources[resourceName] = {
            class: constructor.name,
            proto: constructor
        };
    }

    static setMethod(proto: Object, methodName: string, name?: string) {
        let cls = Resources.methods[proto.constructor.name];
        if (!cls)
            Resources.methods[proto.constructor.name] = (cls = {});

        cls[name || methodName] = methodName;
    }

    private static getMethod(resourceName: string, methodName: string) {
        const res = Resources.resources[resourceName];
        const method = Resources.methods[res.class][methodName];

        const resourceInstance = new res.proto();

        return resourceInstance[method];
    }

    processRequest(request: Request) {
        if (!request || !request.method)
            return {
                name: 'linguedo-teachers-service',
                date: new Date()
            };

        AuthService.auth(request.token);

        const method = Resources.getMethod('myResource', request.method);

        return method(request.body);
    }
}

@requestMappingClass('myResource')
class MyResource {


    @requestMappingMethod()
    login(data: { token: string }) {
        return AuthService.login(data.token);
    }

    @requestMappingMethod()
    getAllTeachers() {
        return new Model().teacher.findAll();
    }

    @requestMappingMethod()
    getAllClassTypes() {
        return new Model().classType.findAll();
    }

    @requestMappingMethod()
    getAllClients() {
        // roleCheck(['teacher']);
        return new Model().client.findAll();
    }

    @requestMappingMethod()
    getAllLessons() {
        return new CalendarService().getAll();
    }

    @requestMappingMethod()
    getAllStudents() {
        return new Model().student.findAll();
    }
}
