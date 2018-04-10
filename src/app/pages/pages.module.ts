import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { BuddyComponent } from './buddy/buddy.component';
import { ChatComponent } from './chat/chat.component';
import { RoomComponent } from './room/room.component';

import { Ng2SmartTableModule } from 'ng2-smart-table';


const PAGES_COMPONENTS = [
  PagesComponent,
];

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    DashboardModule,
    Ng2SmartTableModule,
  ],
  declarations: [
    ...PAGES_COMPONENTS,
    BuddyComponent,
    ChatComponent,
    RoomComponent,
  ],
  providers: [
  ],
})
export class PagesModule {
}
