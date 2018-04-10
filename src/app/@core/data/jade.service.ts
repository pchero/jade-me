import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Router } from '@angular/router';

import * as TAFFY from 'taffy';

@Injectable()
export class JadeService {
  
  private authtoken: string = '';
  private baseUrl: string = 'https://' + window.location.hostname + ':8081';
  private websockUrl: string = 'wss://' + window.location.hostname + ':8083';
  private info: any = {};
  private messages: any = {};
  private cur_chat: string = '';

  // database  
  private db_buddies = TAFFY();
  private db_chats = TAFFY();

  constructor(private http: HttpClient, private route: Router) {
    console.log("Fired jade.service.");

    if(this.authtoken === '') {
      this.route.navigate(['/login']);
    }
  }

  init() {
    // get info
    this.htp_get_info().subscribe(
      data => {
        console.log(data);
        this.info = data.result;
      }
    )

    // get buddy list
    this.htp_get_buddy().subscribe(
      data => {
        console.log(data);
        const list = data.result;
        for(let i = 0; i < list.length; i++) {
          this.db_buddies.insert(list[i]);
        }
      }
    );
    
    // get chat list
    this.htp_get_chat().subscribe(
      data => {
        console.log(data);
        const list = data.result;
        for(let i = 0; i < list.length; i++) {
          this.db_chats.insert(list[i]);

          // set message db
          const uuid = list[i].uuid;
          let db_messages = TAFFY();
          this.messages[uuid] = db_messages;

          // init message db
          this.init_chatmessage(uuid);
        }
      }
    );
  }

  set_authtoken(token: string) {
    console.log('Update token. token: ' + token);
    this.authtoken = token;
  }
  
  set_curchat(uuid: string) {
    this.cur_chat = uuid;
  }


  get_info() {
    return this.info;
  }

  get_curchat() {
    return this.cur_chat;
  }

  get_buddies() {
    return this.db_buddies;
  }

  get_chats() {
    return this.db_chats;
  }

  get_messages(uuid: string) {
    return this.messages[uuid];
  }

  get_messges_more(uuid: string, timestamp: string, count: number) {

  }

  private init_chatmessage(uuid:string) {
    this.htp_get_chatmessages(uuid).subscribe(
      data => {
        console.log(data);
        const message_list = data.result;
        for(let j = 0; j < message_list.length; j++) {
          this.messages[uuid].insert(message_list[j]);
        }
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

}
