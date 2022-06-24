
<template>
     <ul>
         <li v-for="(item,index) in mpdstatus">{{ index }} == {{ item }}</li>
     </ul>
</template>


<script setup>
    import { useMpdStatusStore } from "@/stores/MpdStatusStore.js";
    import { storeToRefs } from 'pinia';
    const { mpdstatus } = storeToRefs(useMpdStatusStore());
    
    console.log('Debug Menu Setup');
</script>
