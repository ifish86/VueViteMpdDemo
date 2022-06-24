
<template>
     <div class="q-pa bg-grey-10 text-white" style="max-width: 300px">
         <q-list dark separator>
            <q-item clickable v-for="(item,index) in menu" @click="updateNavRoutePath(item)">
                <q-item-section>{{ item.label }}</q-item-section>
            </q-item>
         </q-list>
     </div>
</template>


<script setup>
    import { RouterView } from "vue-router";
    import router from "@/router.js";
    
    console.log('Main Menu Setup');
</script>

<script>
    export default {
    name: 'Menu',
    data() {
        return { 
            menu:{
                settings: {
                    label:"Settings",
                    icon:"gear",
                    path:"\\settings"
                },
                status: {
                    label:"Status",
                    icon:"gear",
                    path:"\\status"
                },
                song: {
                    label:"Current Track",
                    icon:"note",
                    path:"\\currentSong"
                }
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
