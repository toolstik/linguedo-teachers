import { TestBed } from '@angular/core/testing';

import { ClassTypeService } from './class-type.service';

describe('ClassTypeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClassTypeService = TestBed.get(ClassTypeService);
    expect(service).toBeTruthy();
  });
});
