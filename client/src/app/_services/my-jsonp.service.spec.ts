import { TestBed } from '@angular/core/testing';

import { MyJsonpService } from './my-jsonp.service';

describe('MyJsonpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MyJsonpService = TestBed.get(MyJsonpService);
    expect(service).toBeTruthy();
  });
});
