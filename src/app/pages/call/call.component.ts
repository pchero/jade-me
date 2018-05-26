import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { JadeService } from '../../@core/data/jade.service';
import { SipService } from '../../@core/data/sip.service';

@Component({
  selector: 'jade-call',
  templateUrl: './call.component.html',
  styleUrls: ['./call.component.scss']
})
export class CallComponent implements OnInit {

  source: LocalDataSource = new LocalDataSource();
  private destination: string;
  private detail;

  constructor(private jService: JadeService, private sipService: SipService) {
    this.detail = {};
    const db = this.jService.get_sipcalls();

    this.source.load(db().get());
    db.settings({
      onDBChange: () => { this.source.load(db().get()); this.detail = {};},
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
      type: {
        title: 'Direction',
        type: 'string',
      },
      from: {
        title: 'Source',
        type: 'string',
      },
      to: {
        title: 'Destination',
        type: 'string',
      },
      username: {
        title: 'Username',
        type: 'string',
      },
      status: {
        title: 'Status',
        type: 'string',
      },
    },
  }

  originate_bt_call() {
    this.sipService.originate(this.destination);
  }

  onRowSelect(event) {
    this.detail = event.data;
  }

  answer_handler() {
    this.detail.call_answer();
  }

  hangup_handler() {
    this.detail.call_terminate();
  }

  ngOnInit() {
    // get
  }

}
