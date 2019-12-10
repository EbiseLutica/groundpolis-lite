<template>
	<a @click="toggle">
		<fa icon="th"/>
		<p>{{ $t('app') }}</p>
		<transition name="zoom-in-top">
			<div class="grid" v-if="isOpen">
				<div class="item" v-for="(item, index) in items" :disabled="item.disabled" @click="launch(item.callback)" :key="index">
					<fa-layer v-if="item.isCalendar" class="icon">
						<fa :icon="item.icon"/>
						<fa-text transform="shrink-13 up-1" style="font-weight:900" :value="month"/>
						<fa-text transform="shrink-11 down-3" style="font-weight:900" :value="day"/>
					</fa-layer>
					<fa v-else :icon="item.icon" class="icon fa-fw"/>
					<div class="text">{{ item.text }}</div>
					<div class="badge" v-if="item.badge()"></div>
				</div>
			</div>
		</transition>
	</a>
</template>

<script lang="ts">
import Vue from 'vue';
import i18n from '../../../i18n';
import MkDriveWindow from './drive-window.vue';
import contains from '../../../common/scripts/contains';

export default Vue.extend({
	i18n: i18n('desktop/views/components/ui.header.apps.vue'),
	data() {
		return {
			connection: null,
			isOpen: false,
			items: [
				{
					text: this.$t('drive'),
					icon: 'cloud',
					callback: () => this.$root.new(MkDriveWindow),
					badge: () => false,
				},
			],
		};
	},
	mounted() {
		if (this.$store.getters.isSignedIn) {
			this.connection = this.$root.stream.useSharedConnection('main');
		}
	},
	beforeDestroy() {
		if (this.$store.getters.isSignedIn) {
			this.connection.dispose();
		}
	},
	methods: {
		toggle() {
			this.isOpen ? this.close() : this.open();
		},
		open() {
			this.isOpen = true;
			for (const el of Array.from(document.querySelectorAll('body *'))) {
				el.addEventListener('mousedown', this.onMousedown);
			}
		},
		onMousedown(e) {
			e.preventDefault();
			if (!contains(this.$el, e.target) && this.$el != e.target) this.close();
			return false;
		},
		close() {
			this.isOpen = false;
			for (const el of Array.from(document.querySelectorAll('body *'))) {
				el.removeEventListener('mousedown', this.onMousedown);
			}
		},
		launch(callback: () => void) {
			if (callback)
				callback();
		},
	},
});
</script>

<style lang="stylus" scoped>
.zoom-in-top-enter-active, .zoom-in-top-leave-active
	transform-origin: center -16px;

a 
	*
		pointer-events none

	&:hover
		color var(--desktopHeaderHoverFg)
		text-decoration none

	> [data-icon]:first-child
		margin-right 8px

	> [data-icon]:last-child
		margin-left 5px
		font-size 10px
		color var(--notificationIndicator)

		@media (max-width 1100px)
			margin-left -5px

	> p
		display inline
		margin 0

		@media (max-width 1100px)
			display none

	@media (max-width 700px)
		padding 0 12px

.grid
	display flex
	flex-wrap wrap
	$bgcolor = var(--face)
	position absolute
	top 56px
	left -1px
	width 288px
	font-size 0.8em
	background $bgcolor
	border-radius 4px
	box-shadow 0 var(--lineWidth) 4px rgba(#000, 0.25)

	&:before
		content ""
		pointer-events none
		display block
		position absolute
		top -28px
		left 12px
		border-top solid 14px transparent
		border-right solid 14px transparent
		border-bottom solid 14px rgba(#000, 0.1)
		border-left solid 14px transparent

	&:after
		content ""
		pointer-events none
		display block
		position absolute
		top -27px
		left 12px
		border-top solid 14px transparent
		border-right solid 14px transparent
		border-bottom solid 14px $bgcolor
		border-left solid 14px transparent

	.item
		width 88px
		margin 4px
		color var(--text)
		cursor pointer
		user-select none
		border-radius 4px
		pointer-events auto

		&[disabled]
			opacity 0.5
			cursor default

			&:hover
				text-decoration none
				background inherit
				color var(--text)
	
				.badge
					background var(--text)

		.icon
			display block
			margin 8px auto
			font-size 32px

		.text
			margin 8px auto
			line-height 32px
			font-size 12px
			text-align center
			display block

		.badge
			position absolute
			right 8px
			top 8px
			width 8px
			height 8px
			border-radius 4px
			background var(--primary)
			animation: blink 2.5s linear infinite;

		&:hover
			text-decoration none
			background var(--primary)
			color var(--primaryForeground)
			
			.badge
				background var(--primaryForeground)
			
@keyframes blink{
  0%, 100% { opacity: 0; }
 30%,  70% { opacity: 1; }
}
</style>
