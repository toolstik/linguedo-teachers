import 'google-apps-script/google-apps-script.spreadsheet'

export class Model {
    
    private model: EntitySession;

    constructor() {
        const spreadsheet = SpreadsheetApp.openById('1W3fLlLxMWJJFa4qZ8iJ4JMkYtUKem2VWknlIm6-UKcg');
        this.model = new EntitySession({
            defaults: {
                spreadsheet: spreadsheet,
                rangeScanLazy: true
            }
        });
    }

    get user() {
        return this.model.getRepository('user');
    }

    get teacher() {
        return this.model.getRepository('teacher');
    }

    get student() {
        return this.model.getRepository('student');
    }
    get studentTeacher() {
        return this.model.getRepository('student_teacher');
    }


    get classType() {
        return this.model.getRepository('class_type');
    }

    get lesson() {
        return this.model.getRepository('lesson');
    }

    get lessonStudent() {
        return this.model.getRepository('lesson_student');
    }

    get project() {
        return this.model.getRepository('project');
    }
}