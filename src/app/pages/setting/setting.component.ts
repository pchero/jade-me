import { Component, OnInit } from '@angular/core';
import { SmartTableService } from '../../@core/data/smart-table.service';
import { LocalDataSource } from 'ng2-smart-table';
import { JadeService } from '../../@core/data/jade.service';

@Component({
  selector: 'jade-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
  private detail: any;

  constructor(private jService: JadeService) {
    this.detail = Object.assign({}, this.jService.get_info());
  }

  update_handler(): void {
    const data = {
      name: this.detail.name
    };

    if(this.detail.password != '') {
      data['password'] = this.detail.password;
    }

    this.jService.update_info(data);
  }

  ngOnInit() {
    // get
  }

}
