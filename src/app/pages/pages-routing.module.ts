import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { BuddyComponent } from './buddy/buddy.component';
import { ChatComponent } from './chat/chat.component';
import { RoomComponent } from './room/room.component';
import { CallComponent } from './call/call.component';
import { SearchComponent } from './search/search.component';
import { SettingComponent } from './setting/setting.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'buddy',
      component: BuddyComponent,
    },
    {
      path: 'chat',
      component: ChatComponent,
    },
    {
      path: 'room',
      component: RoomComponent,
    },
    {
      path: 'call',
      component: CallComponent,
    },
    {
      path: 'search',
      component: SearchComponent,
    },
    {
      path: 'setting',
      component: SettingComponent,
    },
    {
      path: '',
      redirectTo: 'call',
      pathMatch: 'full',
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
