<template>
    <div class="q-ma-none">
        <q-toolbar class="bg-primary text-white">
            <q-btn flat round dense class="q-mr-sm" @click="addAllThisToQueue()">
                <span class="my-app-icon icon-add"></span>
            </q-btn>
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
        
        <q-img v-if="value.cover"
            :src="value.cover"
            :ratio="1"
            class="lHh-mt-md"
            
        />
        
        <span class="label" v-if="value.directory">{{ value.label}}</span>
        <span class="label" v-if="value.playlist">{{ value.playlist}}</span>
        <span class="label" v-if="value.title">{{ value.title}}</span>
        
        <span class="label detail secondary" v-if="value.artist">{{ value.artist }}</span>
        <span class="label detail aux" v-if="value.time">{{ value.time }}</span>
        
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
                getRequest('/api/lsinfo', JSON.stringify({path:this.lsinfo.values[item].directory}), true, function (nd, post, url, headers) {this.mpdStore.updateMpdLibPath(nd, post, url, headers);}.bind(this));
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
            
            
            getRequest('/api/lsinfo', JSON.stringify({path:this.libraryCrumbs[item].path}), true, function (nd, post, url, headers) {this.mpdStore.updateMpdLibPath(nd, post, url, headers);}.bind(this));
            
            for (var i = item; i < c; ++i) {
                this.libraryCrumbs.pop();
            }
        },
        addAllThisToQueue() {
            console.log(this.lsinfo.path);
            getRequest('/api/add', JSON.stringify({entry:this.lsinfo.path}), true, function (nd, post, url, headers) {this.mpdStore.getMpdPlaylist(nd, post, url, headers);}.bind(this));
        },
        
    },
    created() {
        console.log(this.menu)
    },
    
    

    }
</script>

