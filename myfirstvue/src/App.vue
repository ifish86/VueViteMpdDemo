

<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          Big F'ing Page - {{ mpdstatus.state }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container >
       <q-page padding >

        <input type="range" :value="mpdstatus.elapsed" min="0" :max="mpdstatus.duration">
        <q-card >
        <q-linear-progress size="50px" :value="mpdstatus.elapsed/mpdstatus.duration" color="accent" class="q-mt-sm">
            <div class="absolute-full flex flex-center">
                <q-badge color="white" text-color="accent" :label="mpdstatus.elapsed" />
            </div>
        </q-linear-progress>
        </q-card>

        

        <ul>
        <li v-for="(item,index) in mpdstatus">{{ index }} == {{ item }}</li>
        </ul>
        </q-page>
    </q-page-container>

    

  </q-layout>
</template>


<script setup>
    import { useMpdStatusStore } from "@/stores/MpdStatusStore.js";
    import { storeToRefs } from 'pinia';
    const { mpdstatus } = storeToRefs(useMpdStatusStore());
    //import MpdSocket from './components/MpdSocket.vue'
    //import { createSocketToMipod } from './MpdSocket.js'
    console.log('App.vue setup');
    import io from "socket.io-client"
    
    
    
</script>


<script>
import { ref } from 'vue';


export default {
  name: 'App',
  
  data() {
      /*
    return { mpdstatus:{repeat:false,random:false,single:false,consume:false,playlist:3,playlistlength:11,mixrampdb:0,state:"play",song:0,songid:1,time:163,elapsed:49,bitrate:1153,duration:163.120,audio:"44100:16:2",nextsong:1,nextsongid:2,audioSampleRate:44100,audioSampleDepth:16,audioChannels:"Stereo"}}
    */
    /*
      return {
          socket: new VueSocketIO({
              debug: true,
              connection: 'http://'+location.host+':89/foo/bar/gee'
          });
      }
      */
      return {
          socket : io('/')
      
      }
  },
  
  mounted() {
      console.log('App.vue mounted');
  },
  unmounted() {
      console.log('App.vue unmounted');
  },
  methods : {
    changeme()
    {
      this.mpdstatus='Yo !';
    }
  },
  created() {
    const mpdstatus = useMpdStatusStore();
    //setInterval(function () { getRequest('/api/status', function(nd) {this.mpdstatus = nd}.bind(this)); }.bind(this), 1500);
    setTimeout(function () { mpdstatus.updateStatus() }, 1000);
    //createSocketToMipod();
  },
  
  

}

function getRequest(url, callback){
	var xmlHttpReqHw = false;
    var self = this;
    
    xmlHttpReqHw = new XMLHttpRequest();
    xmlHttpReqHw.open('GET', url, true);
    xmlHttpReqHw.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xmlHttpReqHw.onreadystatechange = function() {
        if (xmlHttpReqHw.readyState == 4) {
            var newData = JSON.parse(xmlHttpReqHw.responseText);
            callback(newData);
        }
    }.bind(callback)
    xmlHttpReqHw.send();
}


var address = window.location.href.replace('http://','')
if (address.slice(-1) == '#') {
	address=address.substr(0,address.length-1);
	console.log(address);
}

var n=address.split('/');
address=n[0];
address = window.location.hostname;

var glbWatchDog = 0;



</script>


