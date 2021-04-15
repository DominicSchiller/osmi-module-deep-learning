import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Ea1PageRoutingModule } from './ea1-routing.module';

import { Ea1Page } from './ea1.page';
import { EA1ComponentsModule } from 'src/app/ea1/components/ea1-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Ea1PageRoutingModule,
    EA1ComponentsModule
  ],
  declarations: [Ea1Page]
})
export class Ea1PageModule {}
