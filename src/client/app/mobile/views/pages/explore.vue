<template>
<mk-ui :displayFab="false">
	<template #header><span style="margin-right:4px;"><fa icon="hashtag"/></span>{{$t('@.explore')}}</template>

	<main>
		<form class="exploreheaderaaa" @submit.prevent="onSubmit">
			<i><fa icon="search"/></i>
			<input v-model="q" type="search" :placeholder="$t('@.search')" v-autocomplete="{ model: 'q' }"/>
			<ul class="tab">
				<li class="item" :class="{ active: mode == 'explore' }" @click="mode = 'explore'">
					{{ $t('@.explore') }}
				</li>
				<li class="item" :class="{ active: mode == 'featured' }" @click="mode = 'featured'">
					{{ $t('@.featured-notes') }}
				</li>
			</ul>
		</form>
		<div style="margin-top: 128px">
			<x-explore v-if="mode === 'explore'" />
			<x-featured platform="mobile" v-else />
		</div>
	</main>
</mk-ui>
</template>

<script lang="ts">
import Vue from 'vue';
import { search } from '../../../common/scripts/search';

type Mode = 'explore' | 'featured';

export default Vue.extend({

	data() {
		return {
			q: '',
			wait: false,
			mode: 'explore' as Mode,
		};
	},

	components: {
		XExplore: () => import('../../../common/views/pages/explore.vue').then(m => m.default),
		XFeatured: () => import('../../../common/views/pages/featured.vue').then(m => m.default)
	},

	mounted() {
	},

	methods: {
		async onSubmit() {
			if (this.wait) return;

			this.wait = true;
			search(this, this.q).finally(() => {
				this.wait = false;
			});
		}
	}
});
</script>

<style lang="stylus" scoped>
.exploreheaderaaa
	position: fixed;
	top 47px
	left 0
	right 0
	padding 8px 8px 0 8px
	background var(--desktopNotificationBg)
	color var(--mobileHeaderFg)
	border-bottom 1px solid rgba(0,0,0,.1)
	border-top 1px solid rgba(0,0,0,.1)
	z-index 4
	.tab
		display grid
		grid-template-columns: 50% 50%
		padding 0 16px
		margin 0
		height 54px
		list-style none
		.item
			display flex
			justify-content center
			align-items center
			user-select none
			cursor pointer
			&.active
				border-bottom: 3px solid var(--primary);

	> i
		display block
		position absolute
		top 16px
		left 4px
		width 48px
		text-align center
		line-height 48px
		color var(--desktopHeaderFg)
		pointer-events none

	> input
		user-select text
		cursor auto
		margin 8px 0 0 0
		padding 6px 18px 6px 36px
		width 100%
		height 48px
		font-size 1em
		background var(--desktopHeaderSearchBg)
		outline none
		border none
		border-radius 24px
		transition color 0.5s ease, border 0.5s ease
		color var(--desktopHeaderSearchFg)

		&::placeholder
			color var(--desktopHeaderFg)

		&:hover
			background var(--desktopHeaderSearchHoverBg)

		&:focus
			box-shadow 0 0 0 2px var(--primaryAlpha05) !important

</style>
