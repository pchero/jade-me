import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { BuddyComponent } from './buddy/buddy.component';
import { ChatComponent } from './chat/chat.component';
import { LoginComponent } from './login/login.component';

const PAGES_COMPONENTS = [
  PagesComponent,
];

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    DashboardModule,
  ],
  declarations: [
    ...PAGES_COMPONENTS,
    BuddyComponent,
    ChatComponent,
    LoginComponent,
  ],
})
export class PagesModule {
}
