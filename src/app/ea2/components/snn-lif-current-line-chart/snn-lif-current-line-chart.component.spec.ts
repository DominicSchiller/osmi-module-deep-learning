import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SnnLifCurrentLineChartComponent } from './snn-lif-current-line-chart.component';

describe('SnnLifCurrentLineChartComponent', () => {
  let component: SnnLifCurrentLineChartComponent;
  let fixture: ComponentFixture<SnnLifCurrentLineChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SnnLifCurrentLineChartComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SnnLifCurrentLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
