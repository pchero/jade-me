import { Component, Input, OnInit } from '@angular/core';

import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { AnalyticsService } from '../../../@core/utils/analytics.service';
import { JadeService } from '../../../@core/data/jade.service';


@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {


  @Input() position = 'normal';

  user: any;

  userMenu = [
    { title: 'Logout', link: '/logout' },
  ];

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private jService: JadeService
              ) {
  }

  ngOnInit() {
    console.log('Fired service info' + this.jService.get_info());
    this.user = this.jService.get_info();
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }

  toggleSettings(): boolean {
    this.sidebarService.toggle(false, 'settings-sidebar');
    return false;
  }

  goToHome() {
    this.menuService.navigateHome();
  }

  onMenuClick(event) {
    console.log("Fired onMenuClick. " + event);
  }

}
