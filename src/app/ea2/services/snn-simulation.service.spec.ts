import { TestBed } from '@angular/core/testing';

import { SNNSimulationService } from './snn-simulation.service';

describe('SnnSimulationService', () => {
  let service: SNNSimulationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SNNSimulationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
