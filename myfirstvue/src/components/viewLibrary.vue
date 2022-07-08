<template>
    <div class="q-ma-none">
        <q-toolbar class="bg-primary text-white">
            <q-btn flat round dense class="q-mr-sm" @click="addAllThisToQueue()">
                <span class="my-app-icon icon-add"></span>
            </q-btn>
            
            <q-btn flat round dense class="q-mr-sm" @click="addAllThisToQueuePlay()">
                <span class="my-app-icon icon-add"></span>
                <q-badge floating color=""><span class="my-app-icon icon-play badge"></span></q-badge>
            </q-btn>
            
            <q-input dark round dense color="white" v-model="currentdata.search" class="q-ml-md" @keyup="searchForThis">
                <template v-slot:prepend>
                    <q-icon v-if="currentdata.search === ''" name="search" />
                    <q-icon v-else name="clear" class="cursor-pointer" @click="clearSearch" />
                </template>
            </q-input>
            
                        
            <q-space/>
            <q-breadcrumbs clickable>
                <q-breadcrumbs-el clickable v-for="(value, key) in libraryCrumbs" @click="libraryNavTo(key)">
                    {{ value.label }}
                </q-breadcrumbs-el>
            </q-breadcrumbs>
        </q-toolbar>
    </div>
    <div v-for="(value, key, index) in lsinfo.values" v-bind:class="currentdata.infoView" class="itemTile" @click="goToDoWhatNext(key)">
        <span v-if="value.directory" class="my-app-icon icon-dir"></span>
        <span v-if="value.playlist" class="my-app-icon icon-playlist"></span>
        <span v-if="value.file" class="my-app-icon icon-song"></span>
        
        <q-img v-if="value.directory"
            :src="common.coverPath(value.directory)"
            :ratio="1"
            class="lHh-mt-md"
            
        />
        
        <q-img v-if="value.file"
            :src="common.coverPath(value.file)"
            :ratio="1"
            class="lHh-mt-md"
            
        />
        
        <span class="label" v-if="value.directory">{{ value.label}}</span>
        <span class="label" v-if="value.playlist">{{ value.playlist}}</span>
        <span class="label" v-if="value.title">{{ value.title}}</span>
        
        <span class="label detail secondary" v-if="value.artist">{{ value.artist }}</span>
        <span class="label detail aux" v-if="value.time">{{ common.stt(value.time) }}</span>
        
    </div>
    <div style="display; block; width: 100%; height: 60px"></div>
</template>




<script setup>
    import { useMpdStatusStore } from "@/stores/MpdStatusStore.js";
    import { storeToRefs } from 'pinia';
    const { lsinfo } = storeToRefs(useMpdStatusStore());
    const { MpdStatusStore } = storeToRefs(useMpdStatusStore());
    const { currentdata } = storeToRefs(useMpdStatusStore());
    const { libraryCrumbs } = storeToRefs(useMpdStatusStore());
    const { socket } = storeToRefs(useMpdStatusStore());
    import { RouterView } from "vue-router";
    import router from "@/router.js";
    
    /* 
     * needed for getting --vt colour variables 
     * this is a bit hacky perhaps theres a better
     * way using assets/base.css without mucking
     * things up
     */
    import styles from '@/assets/colour.css'
    
    
    import { getRequest } from '@/services/ajax.js'
    import * as common from '@/services/common.js'
    
    /*
     * used to access mpdstatusstore actions
     */
    const mpdStore = useMpdStatusStore();
    
    //const * as statusmpdstore = storeToRefs(useMpdStatusStore());
    console.log('Library View');
</script>



<script>
    export default {
    name: 'Menu',
    data() {
         return { 
            menu:{
                settings: {
                    label:"Home",
                    icon:"icon-home",
                    path:""
                },
                
            }
        };
    },
    methods : {
        goToDoWhatNext(item) {
            if (this.lsinfo.values[item].directory) {
                this.updateLsinfoStore(this.lsinfo.values[item].directory);
            } else if (this.lsinfo.values[item].playlist) {
                console.log('is a playlist');
            } else if (this.lsinfo.values[item].file) {
                console.log('is a file');
                console.log(this.lsinfo.values[item]);
                getRequest('/api/add', JSON.stringify({entry:this.lsinfo.values[item].file}), true, function (nd, post, url, headers) {this.mpdStore.getMpdPlaylist(nd, post, url, headers);}.bind(this));
            }
        },
        libraryNavTo(item) {
            var c = this.libraryCrumbs.length;
            this.currentdata.search = '';
            this.updateLsinfoStore(this.libraryCrumbs[item].path);
            
            for (var i = item; i < c; ++i) {
                this.libraryCrumbs.pop();
            }
        },
        updateLsinfoStore(path) {
            getRequest('/api/lsinfo', JSON.stringify({path:path}), true, function (nd, post, url, headers) {this.mpdStore.updateMpdLibPath(nd, post, url, headers, false);}.bind(this));
        },
        addAllThisToQueue() {
            console.log(this.lsinfo.path);
            getRequest('/api/add', JSON.stringify({entry:this.lsinfo.path}), true, function (nd, post, url, headers) {this.mpdStore.getMpdPlaylist(nd, post, url, headers);}.bind(this));
        },
        addAllThisToQueuePlay() {
            getRequest('/api/add', JSON.stringify({entry:this.lsinfo.path}), true, function (nd, post, url, headers) {this.mpdStore.getMpdPlaylist(nd, post, url, headers);this.socket.emit('play');}.bind(this));
            
        },
        searchForThis() {
            if (this.currentdata.search) {
                getRequest('/api/search/any', JSON.stringify({search:this.currentdata.search}), true, function (nd, post, url, headers) {this.mpdStore.updateMpdLibPath(nd, post, url, headers, true);}.bind(this));
            } else {
                this.updateLsinfoStore(this.lsinfo.path);
                this.libraryCrumbs.pop();
            }
        },
        clearSearch() {
            this.currentdata.search = '';
            this.updateLsinfoStore(this.lsinfo.path);
            console.log(this.lsinfo.path);
        },
    },
    created() {
        console.log(this.menu)
    },
    
    

    }
</script>

