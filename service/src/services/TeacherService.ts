import {AuthService} from '../../dist/main';
import {Model} from "../Model";
import {TeacherDto} from '../../../shared/transfer/TeacherDto';
import {LessonDto} from "../../../shared/transfer/LessonDto";
import {LessonService} from "./LessonService";
import {CalendarService} from "./CalendarService";

export class TeacherService {

    private lessonService: LessonService;

    constructor(
        private model = new Model(),
    ) {
        this.lessonService = new LessonService(model, new CalendarService(), this)
    }

    getAll() {
        return this.model.teacher.findAll() as TeacherDto[];
    }

    getCurrent(): TeacherDto {
        const user = AuthService.getCurrentUser();

        if (!user) return null;

        return this.model.teacher.findOne({id: user.id}) as TeacherDto;
    }

    getTeachersForLesson(lesson: LessonDto) {

        lesson = this.lessonService.getById(lesson.id);

        const teachersMap = this.lessonService.getAll()
            .filter(l => {
                return l.startTime < lesson.endTime && l.endTime > lesson.startTime;
            })
            .map(l => l.teacher)
            .reduce((map, t) => {
                if (!map[t.id])
                    map[t.id] = t;

                return map;
            }, {});

        return this.getAll()
            .filter(t => !teachersMap[t.id]);
    }
}

