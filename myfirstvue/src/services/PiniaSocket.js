//A socket.io plugin for pinia store

//import { PiniaPluginContext } from "pinia";
import io from "socket.io-client"
import { getRequest } from '@/services/ajax.js'

export function PiniaSocketPlugin(context) {
  const socket = io('/');
  
  
  context.store.socket = socket;
  
  socket.on('onchange', function(data){
      console.log(data);
      if (data.status) {
          context.store.updateMpdStatus(JSON.stringify(data.status));
      } 
      
      if (data.current) {
          context.store.updateMpdCurrent(JSON.stringify(data.current));
      }
  });
  
  socket.on('status', function(data){
      context.store.updateMpdStatus(JSON.stringify(data.content));
  });
  
  socket.on('connect', function () {
      console.log('socket.io connected!');
      //socket.emit('status');
      //setInterval(function(){socket.emit('status');},1000);
      //console.log(context.store.mpdstatus);
      if (context.store.trackUpdateStoreValues) {
          console.log("Clearing UpdateStoreValues Timeout!");
          clearTimeout(context.store.trackUpdateStoreValues);
      }
      context.store.updateStoreValues(0);
  });
  
  getRequest('/api/status', false, false, function(nd) {context.store.updateMpdStatus(nd);});
  getRequest('/api/current', false, false, function(nd) {context.store.updateMpdCurrent(nd);});
  getRequest('/api/lsinfo', JSON.stringify({path:"/"}), true, function (nd) {context.store.updateMpdLibPath(nd);});
  
  console.log("Plugin Loaded !!!!");
  return { socket };
}



