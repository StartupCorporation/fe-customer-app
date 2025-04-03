import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsCharacteristicsTableComponent } from './products-characteristics-table.component';

describe('ProductsCharacteristicsTableComponent', () => {
  let component: ProductsCharacteristicsTableComponent;
  let fixture: ComponentFixture<ProductsCharacteristicsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsCharacteristicsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsCharacteristicsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
