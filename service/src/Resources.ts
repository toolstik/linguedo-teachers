class Resources {

    processRequest(request: Request) {
        if (!request || !request.method)
            return {
                name: 'linguedo-teachers-service',
                date: new Date()
            };

        AuthService.auth(request.token);

        return this[request.method](request.body);
    }

    login(data: { token: string }) {
        return AuthService.login(data.token);
    }

    getAllTeachers() {
        return new Model().teacher.findAll();
    }

    getAllClassTypes() {
        return new Model().classType.findAll();
    }

    getAllClients() {
        roleCheck(['teacher']);
        return new Model().client.findAll();
    }

    getAllLessons() {
        return new CalendarService().getAll();
    }

    getAllStudents() {
        return new Model().student.findAll();
    }

}
