<template>
    <div v-for="(value, key, index) in lsinfo.values" class="itemTile" @click="goToDoWhatNext(key)">
        <span v-if="value.directory" class="my-app-icon icon-dir"></span>
        <span v-if="value.playlist" class="my-app-icon icon-playlist"></span>
        
        <q-img v-if="value.cover"
            :src="value.cover"
            :ratio="1"
            class="lHh-mt-md"
            
        />
        
        <span class="label" v-if="value.directory">{{ value.label}}</span>
        <span class="label" v-if="value.playlist">{{ value.playlist}}</span>
    </div>
</template>




<script setup>
    import { useMpdStatusStore } from "@/stores/MpdStatusStore.js";
    import { storeToRefs } from 'pinia';
    const { lsinfo } = storeToRefs(useMpdStatusStore());
    const { MpdStatusStore } = storeToRefs(useMpdStatusStore());
    
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
            }
        }
    },
    created() {
        console.log(this.menu)
    },
    
    

    }
</script>

<style>
    
    div.itemTile {
        position: relative;
        display: block-inline;
        width: 200px;
        height: 200px;
        background: var(--q-secondary);
        margin: 5px;
        float: left;
    }
    
    div.itemTile span.my-app-icon {
        font-size: 90px;
        display: block;
        width:100%;
        text-align: center;
        color: var(--vt-c-white-soft);
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
    
    div.itemTile div.q-img {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
    }


</style>
