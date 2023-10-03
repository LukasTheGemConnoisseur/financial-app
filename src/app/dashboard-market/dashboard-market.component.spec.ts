import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMarketComponent } from './dashboard-market.component';

describe('DashboardMarketComponent', () => {
  let component: DashboardMarketComponent;
  let fixture: ComponentFixture<DashboardMarketComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardMarketComponent]
    });
    fixture = TestBed.createComponent(DashboardMarketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
