/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ProductsMockService } from './products-mock.service';

describe('Service: ProductsMock', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductsMockService]
    });
  });

  it('should ...', inject([ProductsMockService], (service: ProductsMockService) => {
    expect(service).toBeTruthy();
  }));
});
