import { TestBed } from '@angular/core/testing';

import { Ml5ClassificationService } from './ml5-classification.service';

describe('Ml5ClassificationService', () => {
  let service: Ml5ClassificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Ml5ClassificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
