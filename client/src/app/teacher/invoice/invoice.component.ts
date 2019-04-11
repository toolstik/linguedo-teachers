import {Component, Input, OnInit} from '@angular/core';
import * as moment from "moment";
import {ClassTypeService} from "../../_services/class-type.service";
import {ClassTypeDto} from "../../../../../shared/transfer/ClassTypeDto";
import {LessonDto} from "../../../../../shared/transfer/LessonDto";

type InvoiceData = Map<Date, Map<string, number>>;

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {

  @Input('lessons')
  set lessonsSetter(value: LessonDto[]) {
    if (value) {
      this.lessons = value;
      this.invoiceData = this.getInvoiceData(value);
    }
  }

  lessons: LessonDto[];
  invoiceData: InvoiceData;

  classTypes: ClassTypeDto[];
  monthSelected: Date;

  constructor(private classTypeService: ClassTypeService) {
  }

  ngOnInit() {
    this.getClassTypes();
  }

  getClassTypes() {
    this.classTypeService.getAll()
      .subscribe(data => {
        this.classTypes = data;
      });
  }

  getInvoiceData(lessons: LessonDto[]) {
    const invoiceData: InvoiceData = new Map();
    for (let lesson of lessons) {
      const date = new Date(lesson.startTime.getFullYear(), lesson.startTime.getMonth(), lesson.startTime.getDate());
      let dateItem = invoiceData.get(date);

      if (!dateItem) {
        dateItem = new Map<string, number>();
        invoiceData.set(date, dateItem);
      }

      let value = dateItem.get(lesson.classType.id) || 0;

      value += lesson.classType.duration;

      dateItem.set(lesson.classType.id, value);
    }

    return invoiceData;
  }

  getDates(month: Date) {
    const fromDate = new Date(month.getFullYear(), month.getMonth(), 1);
    const toDate = new Date(month.getFullYear(), month.getMonth() + 1, 1);

    const result: Date[] = [];

    // for (let d = fromDate; d < toDate; d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)) {
    //   result.push(d);
    // }

    this.invoiceData.forEach((value, key) => {
      if (key >= fromDate && key < toDate)
        result.push(key);
    });

    return result.sort((a, b) => a.getTime() - b.getTime());
  }

  invoiceMonths() {
    let m = new Date();
    const result: Date[] = [];
    for (let i = 0; i < 3; i++) {
      m = new Date(m.getFullYear(), m.getMonth() - 1, 1);
      result.unshift(m);
    }

    return result;
  }

  getCellValue(date: Date, classType: ClassTypeDto) {
    const dateItem = this.invoiceData.get(date);

    if (!dateItem) return 0;

    const typeItem = dateItem.get(classType.id);

    return typeItem || 0;
  }

  monthDisplayFunc = (m: Date) => moment(m).format('MMMM YYYY')
}
