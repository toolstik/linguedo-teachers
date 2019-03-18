class Resources {

    login(requestBody: { token: string }) {
        return new AuthService().login(requestBody.token);
    }

    getAllTeachers() {
        return new Model().teacher.findAll();
    }

    getAllClassTypes() {
        return new Model().classType.findAll();
    }

    getAllClients() {
        return new Model().client.findAll();
    }

    getAllLessons() {
        return new CalendarService().getAll();
    }

}
