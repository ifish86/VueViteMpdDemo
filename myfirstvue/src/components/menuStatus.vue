
<template>
     <div class="q-pa bg-grey-10 text-white" style="max-width: 300px">
         <q-list dark separator>
            <q-item clickable v-for="(item,index) in menu" @click="updateNavRoutePath(item)">
                <q-item-section v-if="item.icon" avatar>
                    <q-avatar>
                        <span v-bind:class="item.icon" class="my-app-icon" ></span>
                    </q-avatar>
                </q-item-section>
                <q-item-section>
                    {{ item.label }}
                </q-item-section>
            </q-item>

            <q-item clickable v-for="(item,index) in mpdstatus">
                <q-item-section>{{ index }}: {{ item }}</q-item-section>
            </q-item>
         </q-list>
     </div>
</template>


<script setup>
    import { useMpdStatusStore } from "@/stores/MpdStatusStore.js";
    import { storeToRefs } from 'pinia';
    const { mpdstatus } = storeToRefs(useMpdStatusStore());
    
    import { RouterView } from "vue-router";
    import router from "@/router.js";
    
    console.log('Status Menu');
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
        console.log(this.menu)
    },
    
    

    }
</script>
