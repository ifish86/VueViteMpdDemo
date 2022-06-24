

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
      <q-toolbar>
        <q-toolbar-title>
          <q-img
            :src="currentsong.cover"
            :key="fill"
            :ratio="1"
            class="q-mt-md"
            style="width: 50px; height: 50px; "
          />
          <div>Title {{ currentsong.path }}</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>


<script setup>
    import { useMpdStatusStore } from "@/stores/MpdStatusStore.js";
    import { storeToRefs } from 'pinia';
    const { mpdstatus } = storeToRefs(useMpdStatusStore());
    const { currentsong } = storeToRefs(useMpdStatusStore());
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
  
  mounted() {
      console.log('App.vue mounted');
  },
  unmounted() {
      console.log('App.vue unmounted');
  },
  methods : {
    toggleLeftDrawer () {
        this.leftDrawerOpen = !this.leftDrawerOpen
    }
  },
  created() {
    const mpdstatus = useMpdStatusStore();
    //setInterval(function () { getRequest('/api/status', function(nd) {this.mpdstatus = nd}.bind(this)); }.bind(this), 1500);
    //setTimeout(function () { mpdstatus.updateStatus() }, 1000);
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


