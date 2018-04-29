
import { UA, WebSocketInterface, RTCSession } from 'jssip';
import * as TAFFY from 'taffy';

export class Call {
  session: RTCSession;

  type: string;
  id: string;
  target: string;
  username: string;
  date: string;
  status: string;
  duration: string;

  from: string;
  to: string;

  private localStream = null;
  private db_calls;

  private remote_audio: HTMLAudioElement;

  constructor(session, db) {
    this.db_calls = db;
    this.set_session(session);

    this.db_calls.insert(this);
  }

  print_info() {
    console.log("type: " + this.type);
    console.log("id: " + this.id);
    console.log("target: " + this.target);
    console.log("username: " + this.username);
    console.log("status: " + this.status);
  }

  set_session(session) {
    this.session = session;
    this.type =  this.session.direction === "incoming" ? 'IN' : 'OUT';
    this.id = this.session.id;
    this.target = this.session.remote_identity.uri.user;
    this.username = this.session.remote_identity.display_name || '';
    this.status = 'ringing';
    this.duration = '';

    if (this.type === 'IN') {
      this.from = this.session.remote_identity.uri.user;
      this.to = this.session.local_identity.uri.user;

      this.set_remote_audio_src('../../../assets/sounds/ringtone_iphone.mp3', true);
    }
    else if (this.type === 'OUT') {
      this.from = this.session.local_identity.uri.user;
      this.to = this.session.remote_identity.uri.user;
      
    }

    session.on('addstream', (e) => this.on_addstream(e));
    session.on('addtrack', (e) => this.on_addstream(e));
    session.on('accepted', (e) => this.on_accepted(e));
    session.on('connecting', (e) => this.on_connecting(e));
    session.on('ended', (e) => this.on_ended(e));
    session.on('failed', (e) => this.on_failed(e));
    session.on('hold', (e) => this.on_hold(e));
    session.on('newDTMF', (e) => this.on_newdtmf(e));
    session.on('progress', (e) => this.on_progress(e));
    session.on('unhold', (e) => this.on_unhold(e));
    session.on('update', (e) => this.on_update(e));
  }

  get_session() {
    return this.session;
  }

  private stop_remote_audio() {
    this.remote_audio.pause();
    this.remote_audio.currentTime = 0;
  }

  private set_remote_audio_stream(stream) {
    console.log("Fired set_localstream")
    this.remote_audio = new Audio();
    this.remote_audio.srcObject = stream;
    this.remote_audio.volume = 1.0;
    this.remote_audio.play();

    // update db
    this.db_update();
  }

  private set_remote_audio_src(src, repeat=false) {
    console.log("Fired set_localstream")
    this.remote_audio = new Audio();
    this.remote_audio.src = src;
    this.remote_audio.volume = 1.0;
    this.remote_audio.play();

    if(repeat == true) {
      this.remote_audio.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
      }, false);
    }

    // update db
    this.db_update();
  }

  private on_accepted(e) {
    console.log("Fired on_accepted. "
    + "localstream:" + this.session.connection.getLocalStreams().length
    + ", remotestream:" + this.session.connection.getRemoteStreams().length);

    this.status = 'active';

    //
    if (this.session.connection.getLocalStreams().length > 0) {
      console.log("Setting local stream.");
      this.localStream = this.session.connection.getLocalStreams()[0];
    }

    // set remote audio
    if (this.session.connection.getRemoteStreams().length > 0) {
      console.log("Setting remote stream.")
      this.set_remote_audio_stream(this.session.connection.getRemoteStreams()[0]);
    }

    if (e.originator === 'remote') {
      if (e.response.getHeader('X-Can-Renegotiate') === 'false') {
        this.session.data.remoteCanRenegotiateRTC = false;
      }
      else {
        this.session.data.remoteCanRenegotiateRTC = true;
      }
    }

    // update db
    this.db_update();
  }

  call_answer() {
    console.log("Fired call_answer.");
    
    if(this.status != 'ringing') {
      return;
    }

    this.stop_remote_audio();
    this.session.answer();

    console.log("peer indentity:" + this.session.connection.peerIdentity)

    this.session.connection.onaddstream = function (e) {
      console.log("Fired onaddstream.");
    }

    this.session.connection.onconnectionstatechange = function (e) {
      console.log("Fired onconnectionstatechange");
    }

    this.session.connection.ontrack = function (e) {
      console.log("Fired ontrack. length:" + e.streams.length);
    }

    // update db
    this.db_update();
  }

  call_hold() {
    this.session.hold();

    // update db
    this.db_update();
  }

  call_unhold() {
    this.session.unhold();

    // update db
    this.db_update();
  }

  call_terminate() {
    this.session.terminate();
  }

  private db_update() {
    this.db_calls({id: this.id}).update(this);
  }

  private db_delete() {
    this.db_calls({id: this.id}).remove();
  }

  private on_addstream(e) {
    console.log("Fired on_addstream.");
  }

  private on_connecting(e) {
    console.log("Fired on_connecting");

    if (this.session.connection.getLocalStreams().length > 0) {
      this.localStream = this.session.connection.getLocalStreams()[0];
    }
  }

  private on_ended(e) {
    console.log("Fired on_ended.");

    this.status = 'finished';
    
    // delete db
    this.db_delete();
    this.stop_remote_audio();
  }

  private on_failed(e) {
    console.log("Fired on_failed.");

    this.status = 'finished';
    
    // delete call
    this.db_delete();
    this.stop_remote_audio();
  }

  private on_hold(e) {
    console.log("Fired on_hold.");
  }

  private on_newdtmf(e) {
    console.log("Fired on_newdtmf.");
  }

  private on_progress(e) {
    console.log("Fired on_progress.");
  }

  private on_unhold(e) {
    console.log("Fired on_unhold.");
  }

  private on_update(e) {
    console.log("Fired on_update.");
  }

}
