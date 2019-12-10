import Vue from 'vue';

import wVersion from './version.vue';
import wBroadcast from './broadcast.vue';
import wCalendar from './calendar.vue';
import wNav from './nav.vue';

Vue.component('mkw-nav', wNav);
Vue.component('mkw-calendar', wCalendar);
Vue.component('mkw-broadcast', wBroadcast);
Vue.component('mkw-version', wVersion);
