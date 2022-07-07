

<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
           <span v-if="!isMobile">mipodUI</span>
           <div v-if="isMobile" class="column" style="height:60px;">
                <div class="col">
                    <q-item-label class="q-mt-sm">{{ currentdata.lineOne }}</q-item-label>
                </div>
                <div class="col">
                    <q-item-label class="q-pt-sx">{{ currentdata.lineTwo }}</q-item-label>
                </div>
            </div>
        </q-toolbar-title>
        
        <q-btn v-if="currentPlaylist.length" flat round dense class="q-mr-sm" @click="showCurrentlyPlaying()">
            <span class="my-app-icon icon-playlist"></span>
            <q-badge floating color="red">{{ currentPlaylist.length }}</q-badge>
        </q-btn>
       
       
        <div v-if="!isMobile">
            <q-btn-toggle
                v-model="currentdata.infoView"
                no-caps
                rounded
                unelevated
                toggle-color="primary"
                color="white"
                text-color="primary"
                :options="[
                    {value: 'tileview', slot: 'tile'},
                    {value: 'listview', slot: 'list'}
                ]"
            >
                <template v-slot:tile>
                <div class="row items-center no-wrap">
                    <span class="my-app-icon icon-tile"></span>
                </div>
                </template>

                <template v-slot:list>
                <div class="row items-center no-wrap">
                    <span class="my-app-icon icon-list"></span>
                </div>
                </template>
            </q-btn-toggle>
        </div>
        
        
        
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

    <q-page-container style="position: absolute;width:100%;">
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
        <q-separator v-if="!isMobile" class="q-ml-xs q-mr-xs" dark vertical inset />
            <div v-if="!isMobile" class="column" style="height:50px;">
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
            
            <q-btn-dropdown v-if="isMobile" stretch flat label="">
                <q-list>
                    <q-item clickable v-close-popup>
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
                    </q-item>
                </q-list>
            </q-btn-dropdown>
            
            <q-btn v-if="!isMobile" flat round dense class="q-mr-sm" @click="toggleConsume">
                <span v-bind:class="mpdstatus.consume.toString()" class="my-app-icon icon-consume"></span>
            </q-btn>
            
            <q-btn v-if="!isMobile" flat round dense class="q-mr-sm" @click="toggleRepeat">
                <span v-bind:class="mpdstatus.repeat.toString()" class="my-app-icon icon-loop"></span>
            </q-btn>
            
            <q-btn v-if="!isMobile" flat round dense class="q-mr-sm" @click="toggleShuffle">
                <span v-bind:class="mpdstatus.random.toString()" class="my-app-icon icon-shuffle"></span>
            </q-btn>
            
            <q-btn v-if="!isMobile" flat round dense class="q-mr-sm" @click="sendCmd('prev')">
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
    const { libraryCrumbs } = storeToRefs(useMpdStatusStore());
    const { lsinfo } = storeToRefs(useMpdStatusStore());
    const { currentPlaylist } = storeToRefs(useMpdStatusStore());
    const { isMobile } = storeToRefs(useMpdStatusStore());
    import { RouterView } from "vue-router";
    import router from "@/router.js";
    
    import { getRequest } from '@/services/ajax.js'
    
    /*
     * used to access mpdstatusstore actions
     */
    const mpdStore = useMpdStatusStore();
    
    console.log(isMobile);
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
      this.toggleLeftDrawer();
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
            getRequest('/api/repeat/0', false, false, function(nd) {console.log(nd);});
        } else {
            getRequest('/api/repeat/1', false, false, function(nd) {console.log(nd);});
        }
    },
    toggleShuffle () {
        if (this.mpdstatus.random) {
            getRequest('/api/random/0', false, false, function(nd) {console.log(nd);});
        } else {
            getRequest('/api/random/1', false, false, function(nd) {console.log(nd);});
        }
    },
    toggleConsume () {
        if (this.mpdstatus.consume) {
            getRequest('/api/consume/0', false, false, function(nd) {console.log(nd);});
        } else {
            getRequest('/api/consume/1', false, false, function(nd) {console.log(nd);});
        }
    },
    gotToHome () {
        console.log('home');
    },
    updateNavRoutePath(item) {
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
    
    showCurrentlyPlaying() {
        console.log(navigator);
        this.updateNavRoutePath({
                    label:"Currently Playing",
                    icon:"icon-playlist",
                    path:"/currentPlaying"
                });
    },
    toggleView(value) {
        console.log('view:'+value);
    },
    
  },
  created() {
    const mpdstatus = useMpdStatusStore();
    
  },
  
  

}


/*
 * this.updateNavRoutePath({
                        label:"Home",
                        icon:"icon-home",
                        path:""
                    });
 * 
 * 
 * 
 */


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

.my-app-icon.badge {
  font-weight: 400;
  font-size: 8px;

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

.icon-tile::before {
    font-family: 'brystonadd';
    content: "\e634";
}

.icon-list::before {
    font-family: 'brystonadd';
    content: "\e632";
}

.icon-dir::before {
    font-family: 'icomoon';
    content: "\e92f";
}

.icon-playlist::before {
    font-family: 'brystonadd';
    content: "\e62f";
}

.icon-add::before {
    font-family: 'brystonadd';
    content: "\e622";
}

.icon-close::before {
    font-family: 'brystonadd';
    content: "\e626";
}

.icon-search::before {
    font-family: 'brystonadd';
    content: "\e62a";
}

div.q-breadcrumbs {
    cursor: default;
}

</style>


<style>
    
    div.itemTile {
        position: relative;
        display: block-inline;
        width: 200px;
        height: 200px;
        cursor: pointer;
        background: var(--q-secondary);
        margin: 5px;
        float: left;
        transition-duration: 0.5s;
    }
    
    div.listview.itemTile {
        width: 100%;
        height: 50px;
        margin: 0;
        border-bottom: solid grey 1px;
    }
    
    div.itemTile span.my-app-icon {
        font-size: 90px;
        display: block;
        width:100%;
        text-align: center;
        color: var(--vt-c-white-soft);
        transition-duration: 0.5s;
    }
    
    div.listview.itemTile span.my-app-icon {
        font-size: 33px;
        width:50px;
    }
    
    div.itemTile span.label {
        position:absolute;
        bottom: 5px;
        display: block;
        width: 90%;
        left: 5%;
        text-align: center;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        color: var(--vt-c-white-soft);
        border-radius: 5px;
        background: var(--q-secondary);
        
    }
    
    div.itemTile span.detail {
        display: none;
    }
    
    div.listview.itemTile span.label.detail.secondary {
        display: block;
        top: 25px;
    }
    
    div.listview.itemTile span.label.detail.aux {
        position: absolute;
        display: block;
        right: 25px;
        width: auto;
        left: auto;
        text-align: right;
    }
    
    div.listview.itemTile span.label {
        left: 55px;
        text-align: left;
        top: 5px;
    }
    
    div.itemTile div.q-img {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        transition-duration: 0.5s;
    }
    
    div.listview.itemTile div.q-img {
        width: 50px;
        height: 50px;
    }
    
     div.itemTile span.playing {
        position: absolute;
        top: 0;
        color: var(--q-secondary);
    }

</style>
