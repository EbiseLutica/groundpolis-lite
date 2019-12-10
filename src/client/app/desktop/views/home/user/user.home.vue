<template>
<div class="lnctpgve">
	<mk-note-detail v-for="n in user.pinnedNotes" :key="n.id" :note="n" :compact="true"/>
	<!--<mk-calendar @chosen="warp" :start="new Date(user.createdAt)"/>-->
	<x-photos :user="user"/>
	<x-timeline ref="tl" :user="user"/>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import i18n from '../../../../i18n';
import XTimeline from './user.timeline.vue';
import XPhotos from './user.photos.vue';

export default Vue.extend({
	i18n: i18n(),
	components: {
		XTimeline,
		XPhotos,
		XPage,
	},
	props: {
		user: {
			type: Object,
			required: true
		}
	},
	methods: {
		warp(date) {
			(this.$refs.tl as any).warp(date);
		}
	}
});
</script>

<style lang="stylus" scoped>
.lnctpgve
	> *
		margin-bottom 16px

</style>
