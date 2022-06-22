import { defineStore } from "pinia";
import io from 'socket.io-client';

export const useMpdStatusStore = defineStore( 'MpdStatusStore', {
    state: () => {
        return {mpdstatus:{repeat:false,random:false,single:false,consume:false,playlist:0,playlistlength:0,mixrampdb:0,state:"stop",song:0,songid:0,time:0,elapsed:0,bitrate:0,duration:0,audio:"",nextsong:0,nextsongid:0,audioSampleRate:0,audioSampleDepth:0,audioChannels:""}}
    },
    actions: {
        updateStatus() {
            this.mpdstatus.repeat = true;
            console.log(this.mpdstatus);
        },
        connectToWebSockets() {
            console.log('lets get live data!');
            this.socketInstance = io("http://localhost:89");
            this.socketInstance.on(
                "message:recieved", (data) => {
                    console.log(data);
                })
        },
        updateMpdStatus(newData) {
            this.mpdstatus = newData;
        },
    },
    created() {
        console.log("hello");
    }
    
});






/*
export const useMpdStatusStore = defineStore( id: "MpdStatusStore", options: {
    state: () => {
        return {mpdstatus:{repeat:false,random:false,single:false,consume:false,playlist:3,playlistlength:11,mixrampdb:0,state:"play",song:0,songid:1,time:163,elapsed:49,bitrate:1153,duration:163.120,audio:"44100:16:2",nextsong:1,nextsongid:2,audioSampleRate:44100,audioSampleDepth:16,audioChannels:"Stereo"}}
    }
});
*/
