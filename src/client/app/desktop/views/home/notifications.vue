<template>
<ui-container>
	<template #header><fa :icon="['far', 'bell']"/> {{ $t('title') }}</template>
	<mk-notifications />
</ui-container>
</template>

<script lang="ts">
import Vue from 'vue';
import i18n from '../../../i18n';

export default Vue.extend({
	i18n: i18n('desktop/views/components/ui.header.notifications.vue'),
	data() {
		return {
            
		};
	},
});
</script>

<style lang="stylus" scoped>
.cpqqyrst
	display block

</style>
