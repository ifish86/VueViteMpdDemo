

<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
           mipodUI
        </q-toolbar-title>
        <q-breadcrumbs>
          <q-breadcrumbs-el label="Home" icon="home" @click="gotToHome"/>
          <q-breadcrumbs-el label="Components" icon="widgets" />
          <q-breadcrumbs-el label="Breadcrumbs" />
        </q-breadcrumbs>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <div class="q-pa bg-grey-10 text-white" style="max-width: 300px">
        <q-list dark separator>
                <q-item clickable v-for="(item,index) in mainMenu" @click="updateNavRoutePath(item)">
                    <q-item-section v-if="item.icon" avatar>
                        <q-avatar>
                            <span v-bind:class="item.icon" class="my-app-icon" ></span>
                        </q-avatar>
                    </q-item-section>
                    <q-item-section>
                        {{ item.label }}
                    </q-item-section>
                </q-item>
            </q-list>
      </div>
    </q-drawer>

    <q-page-container>
        <RouterView />
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
                show-value
                font-size="12px"
                :value="parseInt(mpdstatus.elapsed)"
                :min="0"
                :max="parseInt(mpdstatus.duration)"
                size="34px"
                :thickness="0.22"
                color="orange"
                class="q-mr-xs"
             >
                {{ currentdata.elapsedFormatted }}
             
             </q-circular-progress>
            
        <q-space/>
            
            <q-btn flat round dense class="q-mr-sm" @click="toggleConsume">
                <span v-bind:class="mpdstatus.consume.toString()" class="my-app-icon icon-consume"></span>
            </q-btn>
            
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
    import router from "@/router.js";
    
    
    console.log('App.vue setup');
    //console.log(useMpdStatusStore);
    
</script>


<script>
import { ref } from 'vue';

export default {
  name: 'App',
  
  data() {
    const leftDrawerOpen = ref(true);
    return { 
        mpdstatus:false,
        leftDrawerOpen,
        url:"/mm/mpd/album44.jpg",
        mainMenu:{
            settings: {
                label:"Settings",
                icon:"icon-settings",
                path:"\\settings"
            },
            status: {
                label:"Status",
                icon:"icon-status",
                path:"\\status"
            },
            song: {
                label:"Current Track",
                icon:"icon-song",
                path:"\\currentSong"
            }
        },
    }

  },
  setup () {
    
    
  },
  mounted() {
      console.log('App.vue mounted');
  },
  unmounted() {
      console.log('App.vue unmounted');
  },
  methods : {
    toggleLeftDrawer () {
        //console.log("hello");
        //console.log(this.leftDrawerOpen);
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
    toggleConsume () {
        if (this.mpdstatus.consume) {
            getRequest('/api/consume/0', function(nd) {console.log(nd);});
        } else {
            getRequest('/api/consume/1', function(nd) {console.log(nd);});
        }
    },
    gotToHome () {
        console.log('home');
    },
    updateNavRoutePath(item) {
            console.log(this.$router.path);
            console.log(item.path);
            router.push({
                name: item.label,
                params: { 
                    name: item.label,
                    isProfileLoaded: true
                }
            });
            //this.$router.push({name: item.label, query:{item.path: null}});
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
  font-weight: 400;
  font-size: 24px;
}

@font-face {
  font-family: 'brystonadd';
  font-style: normal; /* whatever is required for your */
  font-weight: 400;   /* webfont.... */
  src: url("./themes/fonts/brystonadd.woff") format("woff");
}

@font-face {
  font-family: 'icomoon';
  font-style: normal; /* whatever is required for your */
  font-weight: 400;   /* webfont.... */
  src: url("./themes/fonts/icomoon.woff") format("woff");
}

.my-app-icon.true {
    /*color: #1976D2;*/
    /*color: orange;*/
    color: var(--q-warning);
}

.icon-home::before {
    font-family: 'icomoon';
    content: "\e902";
}

.icon-play::before {
    font-family: 'brystonadd';
    content: "\e616";
}

.icon-pause::before {
    font-family: 'brystonadd';
    content: "\e615";
}

.play::before {
    font-family: 'brystonadd';
    content: "\e615" !important;
}


.icon-stop::before {
    font-family: 'brystonadd';
    content: "\e614";
}

.icon-next::before {
    font-family: 'brystonadd';
    content: "\e613";
}

.icon-previous::before {
    font-family: 'brystonadd';
    content: "\e612";
}

.icon-shuffle::before {
    font-family: 'brystonadd';
    content: "\e617";
}

.icon-loop::before {
    font-family: 'brystonadd';
    content: "\e618";
}

.icon-consume::before {
    font-family: 'icomoon';
    content: "\e916";
}

.icon-settings::before {
    font-family: 'brystonadd';
    content: "\e62c";
}

.icon-status::before {
    font-family: 'brystonadd';
    content: "\e62b";
}

.icon-song::before {
    font-family: 'brystonadd';
    content: "\e630";
}


</style>
