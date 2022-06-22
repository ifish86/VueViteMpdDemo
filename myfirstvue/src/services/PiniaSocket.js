//A socket.io plugin for pinia store

//import { PiniaPluginContext } from "pinia";
import io from "socket.io-client"

export function PiniaSocketPlugin(context) {
  const socket = io('/');
  context.store.socket = socket;
  
  socket.on('onchange', function(data){
      console.log(data);
      /*if (data.status) {
          context.store.updateMpdStatus(data.status);
      }*/
  });
  
  
  console.log("Plugin Loaded !!!!");
  return { socket };
}
