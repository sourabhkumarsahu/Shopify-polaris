import { createApp } from 'vue';
import App from './App.vue';
import sortable from '.~src/directives/sortable';

const app = createApp(App);
app.directive('sortable', sortable);
app.mount('#app');