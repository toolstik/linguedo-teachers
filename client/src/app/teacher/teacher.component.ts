import {Component, OnInit} from '@angular/core';
import {TestService} from "../_services/test.service";

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {

  testData:any;

  constructor(private testService: TestService) {
  }

  ngOnInit() {
    this.testService.exec('testMeth', { param1:true, param2:'string value'}).subscribe(data =>{
      // this.testData = JSON.stringify(data);
      this.testData = data.param2;
    })
  }

}
