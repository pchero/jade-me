import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Router } from '@angular/router';

import * as TAFFY from 'taffy';
// import * as io from 'socket.io-client';
import {$WebSocket, WebSocketSendMode} from 'angular2-websocket/angular2-websocket';

import { SipService } from './sip.service';

@Injectable()
export class JadeService {
  
  private authtoken: string = '';
  private baseUrl: string = 'https://' + window.location.hostname + ':8081/v1';
  private websockUrl: string = 'wss://' + window.location.hostname + ':8083';
  // private websock;
  private websock: $WebSocket;

  private info: any = {};
  private contacts: any = {};
  private messages: any = {};
  private cur_chat: string = '';
  private cur_chatroom: string = '';

  // database  
  private db_buddies = TAFFY();
  private db_chats = TAFFY();
  private db_calls = TAFFY();
  private db_sipcalls = TAFFY();
  private db_search = TAFFY();

  constructor(private http: HttpClient, private sipService: SipService, private route: Router, private injector:Injector) {
    console.log("Fired jade.service.");

    if(this.authtoken === '') {
      this.route.navigate(['/login']);
    }
  }

  init(): Observable<boolean> {

    let observable = Observable.create(observer => {
      this.htp_get_info().subscribe(
        data => {
          console.log(data);
          this.info = data.result;
          
          // keep the init order.
          this.init_websock();

          this.init_buddy();
          this.init_chat();
          this.init_call();
          this.init_contact();
    
          observer.next(true);
          observer.complete();    
        }
      )      
    });
    
    return observable;
  }

  set_authtoken(token: string) {
    console.log('Update token. token: ' + token);
    this.authtoken = token;
  }
  
  set_curchat(uuid: string) {
    this.cur_chat = uuid;
  }

  set_curchatroom(uuid: string) {
    console.log('set_curchatroom: ' + uuid);
    this.cur_chatroom = uuid;
  }


  get_info() {
    return this.info;
  }

  update_info(data: any) {
    const url = this.baseUrl + '/me/info?authtoken=' + this.authtoken;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };    

    this.http.put<any>(url, JSON.stringify(data), httpOptions)
    .pipe(
      map(data => data),
      catchError(this.handleError<any>('update_info'))
    )
    .subscribe(
      data => {
        console.log(data);
      }
    );

  }

  get_my_uuid() {
    return this.info.uuid;
  }

  get_curchat() {
    return this.cur_chat;
  }

  get_curchatroom() {
    return this.cur_chatroom;
  }

  get_contact() {
    return this.contacts;
  }

  get_buddies() {
    return this.db_buddies;
  }

  get_chats() {
    return this.db_chats;
  }

  get_calls() {
    return this.db_calls;
  }

  get_sipcalls() {
    return this.db_sipcalls;
  }

  get_chat(uuid: string) {
    console.log('get_chat: ' + uuid);
    const res = this.db_chats({uuid: uuid}).first();
    const j_res = JSON.stringify(res);

    return JSON.parse(j_res);
  }

  get_chatroom_messages(uuid: string) {
    return this.messages[uuid];
  }

  get_messges_more(uuid: string, timestamp: string, count: number) {

  }

  get_search() {
    return this.db_search;
  }

  send_chatmessage(message: string) {
    const url = this.baseUrl + '/me/chats/' + this.cur_chat + '/messages?authtoken=' + this.authtoken;
    console.log('url: ' + url);

    const data = {message: message};
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };    

    this.http.post<any>(url, JSON.stringify(data), httpOptions)
    .pipe(
      map(data => data),
      catchError(this.handleError<any>('send_message'))
    )
    .subscribe(
      data => {
        console.log(data);
      }
    );
  }

  send_search(filter: string, type: string) {
    const url = this.baseUrl + '/me/search' + '?authtoken=' + this.authtoken + '&filter=' + filter + '&type=' + type;

    // clear search db
    this.db_search().remove();

    this.http.get<any>(url)
    .pipe(
      map(data => data),
      catchError(this.handleError('get_call'))
    )
    .subscribe(
      data => {
        console.log(data);

        const data_list = data.result.list;
        for(let i = 0; i <data_list.length; i++) {
          this.db_search.insert(data_list[i]);
        }
      }
    );
  }

  send_call(destination: string, type: string) {
    const url = this.baseUrl + '/me/calls?authtoken=' + this.authtoken;

    const j_data = {
      destination_type: type,
      destination: destination
    }
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };    

    this.http.post<any>(url, JSON.stringify(j_data), httpOptions)
    .pipe(
      map(data => data),
      catchError(this.handleError<any>('add_buddy'))
    )
    .subscribe(
      data => {
        console.log(data);
      }
    );
  }

  add_buddy(uuid: string, name: string=null, detail: string=null) {
    const url = this.baseUrl + '/me/buddies?authtoken=' + this.authtoken;

    const data = {uuid_user: uuid};
    if(name != null) {
      data['name'] = name;
    }
    if(detail != null) {
      data['detail'] = detail;
    }

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };    

    this.http.post<any>(url, JSON.stringify(data), httpOptions)
    .pipe(
      map(data => data),
      catchError(this.handleError<any>('add_buddy'))
    )
    .subscribe(
      data => {
        console.log(data);
      }
    );
  }

  update_buddy(uuid: string, data: any) {
    const url = this.baseUrl + '/me/buddies/' + uuid + '?authtoken=' + this.authtoken;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };    

    this.http.put<any>(url, JSON.stringify(data), httpOptions)
    .pipe(
      map(data => data),
      catchError(this.handleError<any>('update_buddy'))
    )
    .subscribe(
      data => {
        console.log(data);
      }
    );
  }

  delete_buddy(uuid: string) {
    const url = this.baseUrl + '/me/buddies/' + uuid + '?authtoken=' + this.authtoken;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };    

    this.http.delete<any>(url, httpOptions)
    .pipe(
      map(data => data),
      catchError(this.handleError<any>('delete_buddy'))
    )
    .subscribe(
      data => {
        console.log(data);
      }
    );
  }

  delete_chat(uuid: string) {
    const url = this.baseUrl + '/me/chats/' + uuid + '?authtoken=' + this.authtoken;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };    

    this.http.delete<any>(url, httpOptions)
    .pipe(
      map(data => data),
      catchError(this.handleError<any>('delete_chat'))
    )
    .subscribe(
      data => {
        console.log(data);
      }
    );
  }

  update_chat(uuid: string, data: any) {
    const url = this.baseUrl + '/me/chats/' + uuid + '?authtoken=' + this.authtoken;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };    

    this.http.put<any>(url, JSON.stringify(data), httpOptions)
    .pipe(
      map(data => data),
      catchError(this.handleError<any>('update_chat'))
    )
    .subscribe(
      data => {
        console.log(data);
      }
    );
  }

  add_sipcall(call) {
    this.db_sipcalls.insert(call);
  }

  add_chat(name: string, detail: string, type: number, members: any) {
    const url = this.baseUrl + '/me/chats?authtoken=' + this.authtoken;

    const j_data = {
      name: name,
      detail: detail,
      type: type,
      members: members
    };

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };    

    this.http.post<any>(url, JSON.stringify(j_data), httpOptions)
    .pipe(
      map(data => data),
      catchError(this.handleError<any>('add_chat'))
    )
    .subscribe(
      data => {
        console.log(data);
      }
    );
  }

  private init_chatmessage(uuid:string, uuid_room: string) {
    console.log('init_chatmessage. uuid: ' + uuid + ', room_uuid: ' + uuid_room);
    this.htp_get_chatmessages(uuid).subscribe(
      data => {
        console.log(data);
        const message_list = data.result.list;
        for(let j = 0; j < message_list.length; j++) {
          this.messages[uuid_room].insert(message_list[j]);
        }
      }
    );
  }

  private init_info() {
    this.htp_get_info().subscribe(
      data => {
        console.log(data);
        this.info = data.result;
      }
    )
  }

  private init_buddy() {
    this.htp_get_buddy().subscribe(
      data => {
        console.log(data);
        const list = data.result.list;
        for(let i = 0; i < list.length; i++) {
          this.db_buddies.insert(list[i]);
        }
      }
    );
  }

  private init_chat() {
    this.htp_get_chat().subscribe(
      data => {
        console.log(data);
        const list = data.result.list;
        for(let i = 0; i < list.length; i++) {          
          
          const uuid = list[i].uuid;
          this.db_chats.insert(list[i]);
        
          const uuid_room = list[i].room.uuid;
          
          // set message db
          this.create_message_db(uuid_room);

          // init message db
          this.init_chatmessage(uuid, uuid_room);
        }
      }
    );
  }

  private init_call() {
    this.htp_get_call().subscribe(
      data => {
        console.log(data);
        const list = data.result.list;
        for(let i = 0; i < list.length; i++) {          
          this.db_calls.insert(list[i]);
        }
      }
    );
  }

  private init_websock() {
    console.log('Fired init_websock.');
    const url = this.websockUrl + '?authtoken=' + this.authtoken;
    console.log("Connecting websocket. url: " + url);

    // init websocket
    this.websock = new $WebSocket(url);

    // set received message callback
    this.websock.onMessage(
      (msg: MessageEvent) => {
          console.log('onMessage ', msg.data);

          // get message
          // {"<topic>": {"<message_name>": {...}}}
          const j_data = JSON.parse(msg.data);
          const topic = Object.keys(j_data)[0];
          const j_msg = j_data[topic];

          // message parse
          this.message_handler(j_msg);
      },
      {autoApply: false},
    );
  }

  private init_contact() {
    console.log('Fired init_contact.');

    this.htp_get_contact().subscribe(
      data => {
        console.log(data);

        this.contacts = data.result.list;

        // sip login
        this.sipService.init(this.db_sipcalls, this.contacts[0].info.id, this.contacts[0].info.password);
      }
    );
  }

  /**
   * Get chat message of given room uuid.
   * @param uuid 
   */
  private htp_get_chatmessages(uuid: string, timestamp: string = '', count: string = '') {
    let url = this.baseUrl + '/me/chats/' + uuid + '/messages?authtoken=' + this.authtoken;
    if(timestamp != '') {
      url = url + '&timestamp=' + timestamp;
    }
    if(count != '') {
      url = url + '&count=' + count;
    }

    return this.http.get<any>(url)
    .pipe(
      map(data => data),
      catchError(this.handleError('get_chatmessages', []))
    );
  }

  private create_message_db(uuid_room: string) {
    if(this.messages[uuid_room] == null) {
      console.log("Create message db. " + uuid_room);
      let db_messages = TAFFY();
      this.messages[uuid_room] = db_messages;
    }
  }

  private delete_message_db(uuid_room: string) {
    delete this.messages[uuid_room];
  }

  /**
   * Login
   */
  login(username, password): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders();

    headers = headers.set("Authorization", "Basic " + btoa(username + ':' + password));
    headers = headers.set("Content-Type", "application/x-www-form-urlencoded");

    const httpOptions = {headers: headers};

    return this.http.post<any>(this.baseUrl + '/me/login', null, httpOptions)
      .pipe(
        map(data => data),
        catchError(this.handleError<any>('login'))
      );
  }

  logout() {
    const url = this.baseUrl + '/me/login?authtoken=' + this.authtoken;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.delete<any>(url, httpOptions)
      .pipe(
        map(data => data),
        catchError(this.handleError<any>('logout'))
      )
      .subscribe(
        data => {
          console.log(data);
          this.authtoken = '';
        }
      );

  }
  
  private htp_get_info(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/me/info?authtoken=' + this.authtoken)
    .pipe(
      map(data => data),
      catchError(this.handleError('htp_get_info', []))
    );
  }

  /**
   * Get buddies info
   */
  private htp_get_buddy(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/me/buddies?authtoken=' + this.authtoken)
    .pipe(
      map(data => data),
      catchError(this.handleError('get_buddy', []))
    );    
  }

  /**
   * Get chats info
   */
  private htp_get_chat(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/me/chats?authtoken=' + this.authtoken)
    .pipe(
      map(data => data),
      catchError(this.handleError('get_chat'))
    )
  }

  /**
   * Get calls info
   */
  private htp_get_call(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/me/calls?authtoken=' + this.authtoken)
    .pipe(
      map(data => data),
      catchError(this.handleError('get_call'))
    )
  }

  /**
   * Get contacts info
   */
  private htp_get_contact(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/me/contacts?authtoken=' + this.authtoken)
    .pipe(
      map(data => data),
      catchError(this.handleError('get_contact'))
    )
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(message);
  }

  /**
   * Jade notification message handler
   */
  private message_handler(j_data) {
    console.log(j_data);

    const type = Object.keys(j_data)[0];
    const j_msg = j_data[type];

    if(type === 'me.chats.message.create') {
      this.message_handler_me_chats_message_create(j_msg);
    }
    else if(type === 'me.buddies.create') {
      this.message_handler_me_buddies_create(j_msg);
    }
    else if(type === 'me.buddies.delete') {
      this.message_handler_me_buddies_delete(j_msg);
    }
    else if(type === 'me.buddies.update') {
      this.message_handler_me_buddies_update(j_msg);
    }
    else if(type === 'me.chats.create') {
      this.message_handler_me_chats_room_create(j_msg);
    }
    else if(type === 'me.chats.update') {
      this.message_handler_me_chats_room_update(j_msg);
    }
    else if(type === 'me.chats.delete') {
      this.message_handler_me_chats_room_delete(j_msg);
    }
    else if(type === 'me.info.update') {
      this.message_handler_me_info_update(j_msg);
    }
    else {
      console.error("Could not find correct message handler.");
    }

  }

  private message_handler_me_chats_message_create(j_msg: any) {
    const room_uuid = j_msg['uuid_room'];
    if(room_uuid == '') {
      return;
    }
    this.messages[room_uuid].insert(j_msg);
  }

  private message_handler_me_buddies_create(j_msg: any) {
    this.db_buddies.insert(j_msg);
  }

  private message_handler_me_buddies_delete(j_msg: any) {
    const uuid = j_msg['uuid'];
    this.db_buddies({uuid: uuid}).remove();
  }

  private message_handler_me_buddies_update(j_msg: any) {
    const uuid = j_msg['uuid'];
    this.db_buddies({uuid: uuid}).update(j_msg);
  }

  private message_handler_me_chats_room_create(j_msg: any) {
    this.db_chats.insert(j_msg);
    this.create_message_db(j_msg.room.uuid);
    console.log("Create chat room. " + j_msg.room.uuid);
  }

  private message_handler_me_chats_room_update(j_msg: any) {
    const uuid = j_msg['uuid'];
    this.db_chats({uuid: uuid}).update(j_msg);
  }

  private message_handler_me_chats_room_delete(j_msg: any) {
    const uuid = j_msg['uuid'];
    this.db_chats({uuid: uuid}).remove(j_msg);
    this.delete_message_db(j_msg.room.uuid);

    console.log("Delete chat room. " + j_msg.room.uuid);
  }

  private message_handler_me_info_update(j_msg: any) {

    for(var k in j_msg) {
      this.info[k] = j_msg[k];
    }
    console.log('Updated info. ' + this.info.name);
  }


}
