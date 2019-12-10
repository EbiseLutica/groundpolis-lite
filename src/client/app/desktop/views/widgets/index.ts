import Vue from 'vue';

import wNotifications from './notifications.vue';
import wTimemachine from './timemachine.vue';
import wTrends from './trends.vue';
import wUsers from './users.vue';
import wPolls from './polls.vue';
import wProfile from './profile.vue';
import wCustomize from './customize.vue';

Vue.component('mkw-notifications', wNotifications);
Vue.component('mkw-timemachine', wTimemachine);
Vue.component('mkw-trends', wTrends);
Vue.component('mkw-users', wUsers);
Vue.component('mkw-polls', wPolls);
Vue.component('mkw-profile', wProfile);
Vue.component('mkw-customize', wCustomize);
