import { TestBed, inject } from '@angular/core/testing';

import { JadeService } from './jade.service';

describe('JadeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JadeService]
    });
  });

  it('should be created', inject([JadeService], (service: JadeService) => {
    expect(service).toBeTruthy();
  }));
});
