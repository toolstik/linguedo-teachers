import { TestBed } from '@angular/core/testing';

import { SubstitutionService } from './substitution.service';

describe('SubstitutionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubstitutionService = TestBed.get(SubstitutionService);
    expect(service).toBeTruthy();
  });
});
