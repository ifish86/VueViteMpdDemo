
<script>
    import { ref } from 'vue';
    import io from "socket.io-client"
    import VueSocketIO from 'vue-3-socket.io'
    
    export default {
        name: 'MpdSocket',
        data() {
            return {
                socket: io("http://192.168.0.190:89"),
            }
        },
        
        methods: {
            echo () {
                console.log(this.socket.io.connected);
            },
            echo() {
                console.log(this.socket.disconnected);
            },
        },
        created() {
            console.log("hello");
            console.log(this.socket);
        }
    }
</script>
