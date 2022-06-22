// MpdSocket.js

import { ref } from 'vue';
import io from "socket.io-client"
import VueSocketIO from 'vue-3-socket.io'


const socket = io.connect("ws://192.168.0.190:89");
socket.on("conenct", () => {
    console.log('connected to socket');
    
});

socket.on("error", (error) => {
    console.log('socket error:'+error);
    
});

console.log('MpdSocket.js loaded');

export function createSocketToMipod() {
    console.log('going to create a socket to mipod');
    /*
    onMounted(() => console.log('do something on mount'));
    onUnmounted(() => console.log('do something on unmount'));
    */
    
}
