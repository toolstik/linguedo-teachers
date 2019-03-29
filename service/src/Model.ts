import 'google-apps-script/google-apps-script.spreadsheet'

export class Model {

    private static staticModel: EntitySession;

    constructor() {
        if (!Model.staticModel) {
            Model.staticModel = new EntitySession({
                defaults: {
                    spreadsheet: SpreadsheetApp.openById('1W3fLlLxMWJJFa4qZ8iJ4JMkYtUKem2VWknlIm6-UKcg'),
                    rangeScanLazy: true
                }
            });
        }
    }

    private get model() {
        return Model.staticModel;
    };

    static commit() {
        this.staticModel.commit();
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