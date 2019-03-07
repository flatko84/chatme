var Vue = require('vue/dist/vue.js');
var VueSocketIO = require('vue-socket.io');

Vue.use(new VueSocketIO({
    debug: true,
    connection: 'http://localhost:3000',
    //options: { path: "/my-app/" } //Optional options
}))

Vue.component('room-component', require('./components/RoomComponent.vue'));
Vue.component('rooms-component', require('./components/RoomsComponent.vue'));

const app = new Vue({
  el: '#app'
})
