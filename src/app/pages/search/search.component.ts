import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { JadeService } from '../../@core/data/jade.service';

@Component({
  selector: 'jade-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  private source: LocalDataSource = new LocalDataSource();
  private search_string: string;
  private detail: any;

  constructor(private jService: JadeService) {
    this.detail = {};
    const db = jService.get_search();

    this.source.load(db().get());
    db.settings({
      onDBChange: () => { this.source.load(db().get()); },
    });
  }

  private settings = {
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    actions: {
      add: false,
      edit: false,
      delete: false,
      columnTitle: '',
    },
    columns: {
      uuid: {
        title: 'Uuid',
        type: 'string',
      },
      username: {
        title: 'Username',
        type: 'string',
      },
      cname: {
        title: 'Name',
        type: 'string',
      },
    },
  }

  search_bt_user() {
    console.log('Fired search_bt_user.');

    this.jService.send_search(this.search_string, "username");
  }

  onRowSelect(event): void {
    this.detail = Object.assign({}, event.data);
    delete this.detail.___id;
    delete this.detail.___s;
  }

  add_buddy_handler(): void {
    this.jService.add_buddy(this.detail.uuid, this.detail.name, '');
  }

  ngOnInit() {
    // get
  }

}
