import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Ea1HelpPageRoutingModule } from './ea1-help-routing.module';

import { EA1HelpPage } from './ea1-help.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Ea1HelpPageRoutingModule
  ],
  declarations: [EA1HelpPage]
})
export class Ea1HelpPageModule {}
