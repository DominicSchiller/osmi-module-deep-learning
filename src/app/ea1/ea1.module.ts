import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Ea1PageRoutingModule } from './ea1-routing.module';

import { EA1Page } from './pages/index/ea1.page';
import { EA1ComponentsModule } from 'src/app/ea1/components/ea1-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Ea1PageRoutingModule,
    EA1ComponentsModule
  ],
  declarations: [EA1Page]
})
export class EA1Module {}
