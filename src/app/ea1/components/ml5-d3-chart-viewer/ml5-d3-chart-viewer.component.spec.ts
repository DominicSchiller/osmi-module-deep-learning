import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Ml5D3ChartViewerComponent } from './ml5-d3-chart-viewer.component';

describe('Ml5D3ChartViewerComponent', () => {
  let component: Ml5D3ChartViewerComponent;
  let fixture: ComponentFixture<Ml5D3ChartViewerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ Ml5D3ChartViewerComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Ml5D3ChartViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
