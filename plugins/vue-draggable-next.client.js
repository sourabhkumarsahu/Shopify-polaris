import { defineNuxtPlugin } from '#app';
import sortable from '~/src/directives/sortable';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive('sortable', sortable);
});