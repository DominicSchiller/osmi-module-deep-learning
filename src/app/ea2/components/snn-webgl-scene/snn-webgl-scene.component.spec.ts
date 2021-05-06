import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SnnWebglSceneComponent } from './snn-webgl-scene.component';

describe('SnnWebglSceneComponent', () => {
  let component: SnnWebglSceneComponent;
  let fixture: ComponentFixture<SnnWebglSceneComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SnnWebglSceneComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SnnWebglSceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
