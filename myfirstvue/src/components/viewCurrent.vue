<template>
    <div class="q-ma-none">
        <q-toolbar class="bg-primary text-white">
            <q-btn flat round dense class="q-mr-sm" @click="clearPlayQueue()">
                Clear
            </q-btn>
            <q-space/>
            <q-btn flat round dense class="q-mr-sm" @click="backToLibrary()">
                <span class="my-app-icon icon-close"></span>
            </q-btn>
        </q-toolbar>
    </div>
    <div v-for="(value, key, index) in currentPlaylist" v-bind:class="currentdata.infoView" class="itemTile" @click="playThisTrack(key)" style="position:relative;">
        <span v-if="value.directory" class="my-app-icon icon-dir"></span>
        <span v-if="value.playlist" class="my-app-icon icon-playlist"></span>
        <span v-if="value.file" class="my-app-icon icon-song"></span>
        
        <q-img v-if="value.cover"
            :src="value.cover"
            :ratio="1"
            class="lHh-mt-md"
            
        />
        
        <span class="label" v-if="value.directory">{{ value.label}}</span>
        <span class="label" v-if="value.playlist">{{ value.playlist}}</span>
        <span class="label" v-if="value.Title">{{ value.Title}}</span>
        
        <span v-if="mpdstatus.song == key" class="my-app-icon icon-play playing"></span>
    </div>
    <div style="display; block; width: 100%; height: 60px"></div>
</template>


<script setup>
    import { useMpdStatusStore } from "@/stores/MpdStatusStore.js";
    import { storeToRefs } from 'pinia';
    const { lsinfo } = storeToRefs(useMpdStatusStore());
    const { MpdStatusStore } = storeToRefs(useMpdStatusStore());
    const { currentdata } = storeToRefs(useMpdStatusStore());
    const { currentPlaylist } = storeToRefs(useMpdStatusStore());
    const { mpdstatus } = storeToRefs(useMpdStatusStore());
    const { socket } = storeToRefs(useMpdStatusStore());
    
        /* 
     * needed for getting --vt colour variables 
     * this is a bit hacky perhaps theres a better
     * way using assets/base.css without mucking
     * things up
     */
    import styles from '@/assets/colour.css'
    
    
    import { getRequest } from '@/services/ajax.js'
    
    /*
     * used to access mpdstatusstore actions
     */
    const mpdStore = useMpdStatusStore();
    
    import { RouterView } from "vue-router";
    import router from "@/router.js";
    
    //const * as statusmpdstore = storeToRefs(useMpdStatusStore());
    console.log('Current View');
</script>

<script>
    export default {
    name: 'Menu',
    data() {
         return { 
            
        };
    },
    methods : {
        playThisTrack(item) {
            console.log(item);
            getRequest('/api/playidx/'+item, false, false, function(nd) {console.log(nd);});
        },
        clearPlayQueue() {
            this.sendCmd('clear');
            this.backToLibrary();
        },
        sendCmd (cmd) {
            this.socket.emit(cmd);
        },
        updateNavRoutePath(item) {
            //console.log(this.$router.path);
            //console.log(item.path);
            router.push({
                name: item.label,
                params: { 
                    name: item.label,
                    isProfileLoaded: true
                }
            });
            //router.reload();
            //this.$router.push({name: item.label, query:{item.path: null}});
        },
        backToLibrary() {
            this.updateNavRoutePath({
                        label:"Home",
                        icon:"icon-home",
                        path:""
                    });
        }
    },
    created() {
        console.log(this.menu)
    },
    
    

    }
</script>


