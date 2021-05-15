import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SNNLIFNeuronSpikesChartComponent } from './snn-lif-neuron-spikes-chart.component';

describe('SnnLifNeuronSpikesChartComponent', () => {
  let component: SNNLIFNeuronSpikesChartComponent;
  let fixture: ComponentFixture<SNNLIFNeuronSpikesChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SNNLIFNeuronSpikesChartComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SNNLIFNeuronSpikesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
