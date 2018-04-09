import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BuddyComponent } from './buddy/buddy.component';
import { ChatComponent } from './chat/chat.component';
import { LoginComponent } from './login/login.component';

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
      path: 'login',
      component: LoginComponent,
    },
    {
      path: 'dashboard',
      component: DashboardComponent,
    }, {
      path: 'ui-features',
      loadChildren: './ui-features/ui-features.module#UiFeaturesModule',
    }, {
      path: 'components',
      loadChildren: './components/components.module#ComponentsModule',
    }, {
      path: 'maps',
      loadChildren: './maps/maps.module#MapsModule',
    }, {
      path: 'charts',
      loadChildren: './charts/charts.module#ChartsModule',
    }, {
      path: 'editors',
      loadChildren: './editors/editors.module#EditorsModule',
    }, {
      path: 'forms',
      loadChildren: './forms/forms.module#FormsModule',
    }, {
      path: 'tables',
      loadChildren: './tables/tables.module#TablesModule',
    }, {
      path: '',
      redirectTo: 'dashboard',
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
