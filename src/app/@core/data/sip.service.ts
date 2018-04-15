import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { Injectable, OnInit } from '@angular/core';
import { UA, WebSocketInterface, RTCSession } from 'jssip';
import 'rxjs/add/operator/map';
import {Observable, Subscriber} from 'rxjs/Rx';

import { Call } from './call.service';
import * as TAFFY from 'taffy';

@Injectable()
export class SipService {
  private wsuri: string = 'wss://' + window.location.hostname + ':8089/ws';
  private wsock: WebSocketInterface;

  // private phones: Array<UA>;
  private ua: UA;
  private localStream = null;
  private db_calls;

  private cb_create_call;
  private cb_delete_call;

  constructor() {
    console.log("Fired SipService.");
    this.wsock = new WebSocketInterface(this.wsuri);
    this.wsock.via_transport = "wss";
  }

  init(db, id: string, password: string) {
    console.log("Fired SipService init. id: " + id + ", password: " + password);

    this.db_calls = db;
    this.sip_login(id, password);
  }

  set_cb_create_call(func) {
    this.set_cb_create_call = func;
  }

  set_cb_delete_Call(fund) {
    this.set_cb_delete_Call = fund;
  }

  sip_login(id: string, password: string) {
    const uri = 'sip:' + id + '@' + window.location.hostname;
    console.log("Fired sip_login. id: " + id, ", password: " + password + ", uri: " + uri);

    const config = {
      sockets: [this.wsock],
      uri: uri,
      password: password,
      autoConnect: false,
      register: true,
      register_expires: 600,
      session_timers: true,
      connection_recovery_min_interval: 2,
      connection_recovery_max_interval: 30,
      registrar_server: '',
      no_answer_timeout: 60,
      use_preloaded_route: false,
      hack_via_tcp: false,
      hack_via_ws: false,
      hack_ip_in_contact: false,

      user_agent: 'jade_me-0.0.1'
    }

    const ua = new UA(config);
    ua.on('connected', (e) => this.on_connected(e));
    ua.on('disconnected', (e) => this.on_disconnected(e));
    ua.on('newMessage', (e) => this.on_newmessage(e));
    ua.on('newRTCSession', (e) => this.on_newrtcsession(e));
    ua.on('registered', (e) => this.on_registered(e));
    ua.on('registrationFailed', (e) => this.on_registrationfailed(e));
    ua.on('registrationExpiring', (e) => this.on_registrationexpiring(e));
    ua.on('unregistered', (e) => this.on_unregistered(e));

    ua.start();
    this.ua = ua;
  }

  originate(destination: string) {
    console.log("Fired originate. destination:" + destination);
    this.ua.call(
      destination,
      {
        mediaConstraints: {'audio': true, 'video': false },
        rtcOfferConstraints: { offerToReceiveAudio: 1, offerToReceiveVideo: 0 }
      }
    );
  }

  private on_connected(e) {
    console.log("Fired on_connected");
  }

  private on_disconnected(e) {
    console.log("Fired on_disconnected");
  }

  private on_newmessage(e) {
    console.log("Fired on_newmessage.");
  }

  private on_newrtcsession(e) {
    console.log("Fired on_newrtcsession. " + e.session);

    const call = new Call(e.session, this.db_calls);
    console.log("Call" + call);
  }

  private on_registered(e) {
    console.log("Fired on_registered.");
  }

  private on_unregistered(e) {
    console.log("Fired on_unregistered.");
  }

  private on_registrationfailed(e) {
    console.log("Fired on_registrationfailed.");
  }

  private on_registrationexpiring(e) {
    console.log("Fired on_registrationexpiring.");
  }

}


