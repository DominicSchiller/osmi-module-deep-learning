import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Ea1HelpPageRoutingModule } from './ea1-help-routing.module';

import { Ea1HelpPage } from './ea1-help.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Ea1HelpPageRoutingModule
  ],
  declarations: [Ea1HelpPage]
})
export class Ea1HelpPageModule {}
