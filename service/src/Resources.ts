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

        if (!res)
            throw new ServiceError(
                'invalid',
                `Resource '${resourceName}' is not found`,
                { user: getCurrentUserName }
            );

        const method = Resources.methods[res.class][methodName];

        if (!method)
            throw new ServiceError(
                'invalid',
                `Method '${methodName}' is not found in resource '${resourceName}'`,
                { user: getCurrentUserName }
            );

        const resourceInstance = new res.proto();

        return resourceInstance[method];
    }

    static processRequest(request: Request) {
        if (!request || !request.method)
            return {
                name: 'linguedo-teachers-service',
                date: new Date()
            };

        AuthService.auth(request.token);

        const method = Resources.getMethod(request.resource, request.method);

        const start = new Date().getTime();
        const result = method(request.body);
        const end = new Date().getTime();

        console.log(`Method '${request.method}' of resource '${request.resource}' has been executed by '${getCurrentUserName()}' in ${end - start}ms`);

        return result;
    }
}


