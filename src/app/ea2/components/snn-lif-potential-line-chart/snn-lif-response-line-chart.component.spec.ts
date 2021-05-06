import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SNNLIFResponseLineChartComponent } from './snn-lif-response-line-chart.component';

describe('SnnLifPotentialLineChartComponent', () => {
  let component: SNNLIFResponseLineChartComponent;
  let fixture: ComponentFixture<SNNLIFResponseLineChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SNNLIFResponseLineChartComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SNNLIFResponseLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
