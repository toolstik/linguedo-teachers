import {Component, OnInit} from '@angular/core';
import {MyJsonpService} from "../_services/my-jsonp.service";

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {

  testData: any;
  events: any[];

  constructor(private testService: MyJsonpService) {
  }

  ngOnInit() {
    this.testService.exec('testMeth', {param1: true, param2: 'string value'}).subscribe(data => {
      // this.testData = JSON.stringify(data);
      // this.testData = JSON.stringify(data.hello);
      this.events = data.hello;
    })
  }

}
