import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { BuddyComponent } from './buddy/buddy.component';
import { ChatComponent } from './chat/chat.component';
import { RoomComponent } from './room/room.component';
import { CallComponent } from './call/call.component';
import { SearchComponent } from './search/search.component';
import { SettingComponent } from './setting/setting.component';

import { Ng2SmartTableModule } from 'ng2-smart-table';


const PAGES_COMPONENTS = [
  PagesComponent,
];

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    Ng2SmartTableModule,
  ],
  declarations: [
    ...PAGES_COMPONENTS,
    BuddyComponent,
    ChatComponent,
    RoomComponent,
    CallComponent,
    SearchComponent,
    SettingComponent,
  ],
  providers: [
  ],
})
export class PagesModule {
}
