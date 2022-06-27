

<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
           mipodUI
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
        <RouterView />
    </q-drawer>

    <q-page-container>
      
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar class="q-pl-none">
        
            <q-img
                :src="currentsong.cover"
                :ratio="1"
                class="lHh-mt-md"
                style="width: 50px; height: 50px; "
            />
            <q-separator class="q-ml-xs q-mr-xs" dark vertical inset />
            <div class="column" style="height:50px;">
            <div class="col">
                <q-item-label class="q-mt-sm">{{ currentdata.lineOne }}</q-item-label>
            </div>
            <div class="col">
                <q-item-label class="q-pt-sx">{{ currentdata.lineTwo }}</q-item-label>
            </div>
            </div>
         <q-separator class="q-ml-xs q-mr-xs" dark vertical inset />
        <q-circular-progress
            :value="parseInt(mpdstatus.elapsed)"
            :min="0"
            :max="parseInt(mpdstatus.duration)"
            size="34px"
            color="orange"
            class="q-mr-xs"
        />
            
        <q-space/>
        
            <q-btn flat round dense class="q-mr-sm" @click="toggleRepeat">
                <span v-bind:class="mpdstatus.repeat.toString()" class="my-app-icon icon-loop"></span>
            </q-btn>
            
            <q-btn flat round dense class="q-mr-sm" @click="toggleShuffle">
                <span v-bind:class="mpdstatus.random.toString()" class="my-app-icon icon-shuffle"></span>
            </q-btn>
            
            <q-btn flat round dense class="q-mr-sm" @click="sendCmd('prev')">
                <span class="my-app-icon icon-previous"></span>
            </q-btn>
            
            <q-btn flat round dense class="q-mr-sm" @click="sendCmd('stop')">
                <span class="my-app-icon icon-stop"></span>
            </q-btn>
            
            <q-btn flat round dense class="q-mr-sm" @click="togglePlayback">
                <span v-bind:class="mpdstatus.state" class="my-app-icon icon-play"></span>
            </q-btn>
            
            <q-btn flat round dense class="q-mr-sm" @click="sendCmd('next')">
                <span class="my-app-icon icon-next"></span>
            </q-btn>
        
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>


<script setup>
    import { useMpdStatusStore } from "@/stores/MpdStatusStore.js";
    import { storeToRefs } from 'pinia';
    const { mpdstatus } = storeToRefs(useMpdStatusStore());
    const { currentsong } = storeToRefs(useMpdStatusStore());
    const { currentdata } = storeToRefs(useMpdStatusStore());
    const { socket } = storeToRefs(useMpdStatusStore());
    import { RouterView } from "vue-router";
    
    
    
    
    console.log('App.vue setup');
    //console.log(useMpdStatusStore);
    
</script>


<script>
import { ref } from 'vue';

export default {
  name: 'App',
  
  data() {
    const leftDrawerOpen = ref(true);
    return { mpdstatus:false,leftDrawerOpen, url:"/mm/mpd/album44.jpg"}

  },
  setup () {
    const $q = useQuasar()
    const appIcons = {
        'app:play': 'img:@src/icons/play.svg',
        'app:stop': 'img:@src/icons/stop.svg',
        'app:pause': 'img:@src/icons/pause.svg',
        'app:next': 'img:@src/icons/next.svg',
        'app:previous': 'img:@src/icons/previous.svg'
    };

    this.$q.iconMapFn = (iconName) => {
        const icon = appIcons[iconName];
        if (icon !== undefined) {
            return { icon: icon };
        }
    };
    
  },
  mounted() {
      console.log('App.vue mounted');
  },
  unmounted() {
      console.log('App.vue unmounted');
  },
  methods : {
    toggleLeftDrawer () {
        this.leftDrawerOpen = !this.leftDrawerOpen
    },
    sendCmd (cmd) {
        this.socket.emit(cmd);
    },
    togglePlayback () {
        if (this.mpdstatus.state == 'play') {
            this.socket.emit('pause');
        } else {
            this.socket.emit('play');
        }
    },
    toggleRepeat () {
        if (this.mpdstatus.repeat) {
            getRequest('/api/repeat/0', function(nd) {console.log(nd);});
        } else {
            getRequest('/api/repeat/1', function(nd) {console.log(nd);});
        }
    },
    toggleShuffle () {
        if (this.mpdstatus.random) {
            getRequest('/api/random/0', function(nd) {console.log(nd);});
        } else {
            getRequest('/api/random/1', function(nd) {console.log(nd);});
        }
    },
  },
  created() {
    const mpdstatus = useMpdStatusStore();
    
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
            //var newData = JSON.parse(xmlHttpReqHw.responseText);
            callback(xmlHttpReqHw.responseText);
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


<style>

.my-app-icon {
  font-family: 'My App Icon';
  font-weight: 400;
  font-size: 24px;
}

@font-face {
  font-family: 'My App Icon';
  font-style: normal; /* whatever is required for your */
  font-weight: 400;   /* webfont.... */
  src: url("./themes/fonts/brystonadd.woff") format("woff");
}

.my-app-icon.true {
    /*color: #1976D2;*/
    color: orange;
}


.icon-play::before {
    content: "\e616";
}

.icon-pause::before {
    content: "\e615";
}

.play::before {
    content: "\e615" !important;
}


.icon-stop::before {
    content: "\e614";
}

.icon-next::before {
    content: "\e613";
}

.icon-previous::before {
    content: "\e612";
}

.icon-shuffle::before {
    content: "\e617";
}

.icon-loop::before {
    content: "\e618";
}



</style>
