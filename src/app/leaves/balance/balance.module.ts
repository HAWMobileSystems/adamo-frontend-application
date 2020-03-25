//balance.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BalanceRoutingModule } from './balance-routing.module';
import { CasualComponent } from './casual/casual.component';
import { EarnedComponent } from './earned/earned.component';
import { BalanceComponent } from './balance.component';
import { Page404balanceComponent } from './page404balance/page404balance.component';
import { SharedModule } from '../../shared.module';
import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';


@NgModule({
  declarations: [
    BalanceComponent,
    CasualComponent,
    EarnedComponent,
    Page404balanceComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    Ng2SearchPipeModule,
    BalanceRoutingModule
  ]
})
export class BalanceModule { }
