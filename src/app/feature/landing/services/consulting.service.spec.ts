/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ConsultingService } from './consulting.service';

describe('Service: Consulting', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConsultingService]
    });
  });

  it('should ...', inject([ConsultingService], (service: ConsultingService) => {
    expect(service).toBeTruthy();
  }));
});
