/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CategoryMockService } from './category-mock.service';

describe('Service: CategoryMock', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CategoryMockService]
    });
  });

  it('should ...', inject([CategoryMockService], (service: CategoryMockService) => {
    expect(service).toBeTruthy();
  }));
});
