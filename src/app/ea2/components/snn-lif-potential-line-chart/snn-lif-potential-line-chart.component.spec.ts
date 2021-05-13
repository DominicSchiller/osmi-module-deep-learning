import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SNNLIFPotentialLineChartComponent } from './snn-lif-potential-line-chart.component';

describe('SnnLifPotentialLineChartComponent', () => {
  let component: SNNLIFPotentialLineChartComponent;
  let fixture: ComponentFixture<SNNLIFPotentialLineChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SNNLIFPotentialLineChartComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SNNLIFPotentialLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
