import { TestBed } from '@angular/core/testing';

import { ProgressionEpsService } from './progression-eps.service';

describe('ProgressionEpsService', () => {
  let service: ProgressionEpsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgressionEpsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
