<template>
<div class="nqfhvmnl">
	<template v-if="page == null || page == 'profile'">
		<x-profile/>
	</template>

	<template v-if="tick >= 1 && page == null || page == 'appearance'">
		<ui-card>
			<template #title><fa icon="desktop"/> {{ $t('@._settings.appearance') }}</template>
			<x-theme/>
			<section v-if="!$root.isMobile">
				<ui-switch v-model="showPostFormOnTopOfTl">{{ $t('@._settings.post-form-on-timeline') }}</ui-switch>
			</section>
			<section>
				<ui-switch v-model="reduceMotion">{{ $t('@._settings.reduce-motion') }}</ui-switch>
				<ui-switch v-model="showVia">{{ $t('@._settings.show-via') }}</ui-switch>
				<ui-switch v-model="useOsDefaultEmojis">{{ $t('@._settings.use-os-default-emojis') }}</ui-switch>
				<ui-switch v-model="useBigCustomEmoji">{{ $t('@._settings.use-big-custom-emoji') }}</ui-switch>
				<ui-switch v-model="suggestRecentHashtags">{{ $t('@._settings.suggest-recent-hashtags') }}</ui-switch>
				<ui-switch v-model="alwaysShowNsfw">{{ $t('@._settings.always-show-nsfw') }}</ui-switch>
				<ui-switch v-model="showReplyTarget">{{ $t('@._settings.show-reply-target') }}</ui-switch>
				<ui-switch v-model="disableShowingAnimatedImages">{{ $t('@._settings.disable-showing-animated-images') }}</ui-switch>
				<ui-switch v-model="remainDeletedNote">{{ $t('@._settings.remain-deleted-note') }}</ui-switch>
			</section>
		</ui-card>
	</template>

	<template v-if="tick >= 1 && page == null || page == 'behavior'">
		<ui-card>
			<template #title><fa icon="sliders-h"/> {{ $t('@._settings.behavior') }}</template>

			<section v-if="tick >= 2">
				<ui-switch v-model="fetchOnScroll">{{ $t('@._settings.fetch-on-scroll') }}
					<template #desc>{{ $t('@._settings.fetch-on-scroll-desc') }}</template>
				</ui-switch>
				<ui-switch v-model="keepCw">{{ $t('@._settings.keep-cw') }}
					<template #desc>{{ $t('@._settings.keep-cw-desc') }}</template>
				</ui-switch>
				<ui-switch v-if="$root.isMobile" v-model="disableViaMobile">{{ $t('@._settings.disable-via-mobile') }}</ui-switch>
			</section>

			<section v-if="tick >= 3">
				<header>{{ $t('@._settings.timeline') }}</header>
				<ui-switch v-model="showMyRenotes">{{ $t('@._settings.show-my-renotes') }}</ui-switch>
				<ui-switch v-model="showRenotedMyNotes">{{ $t('@._settings.show-renoted-my-notes') }}</ui-switch>
				<ui-switch v-model="showLocalRenotes">{{ $t('@._settings.show-local-renotes') }}</ui-switch>
			</section>

			<section v-if="tick >= 4">
				<header>{{ $t('@._settings.note-visibility') }}</header>
				<ui-switch v-model="rememberNoteVisibility">{{ $t('@._settings.remember-note-visibility') }}</ui-switch>				
				<section>
					<header>{{ $t('@._settings.default-note-visibility') }}</header>
					<ui-select v-model="defaultNoteVisibility">
						<option v-for="visibility in visibilities" :value="visibility" :key=visibility>{{ $t(`@.note-visibility.${visibility}`) }}</option>
					</ui-select>
				</section>
			</section>

			<section v-if="tick >= 5">
				<header>{{ $t('@._settings.visibility-switch') }}</header>
				<p>{{ $t('@._settings.visibility-switch-desc') }}</p>
				<ui-switch v-model="useVisibilitySwitch">{{ $t('@._settings.use-visibility-switch') }}</ui-switch>
				<template v-if="useVisibilitySwitch">
					<!-- Home -->
					<ui-select v-model="homeNoteVisibility">
						<template #label>{{ $t('@._settings.visibility-switch-home') }}</template>
						<option v-for="visibility in visibilities" :value="visibility" :key=visibility>{{ $t(`@.note-visibility.${visibility}`) }}</option>						
						<option value="default">{{ $t('@._settings.default-note-visibility') }}</option>
					</ui-select>
					<!-- Local -->
					<ui-select v-model="localNoteVisibility">
						<template #label>{{ $t('@._settings.visibility-switch-local') }}</template>
						<option v-for="visibility in visibilities" :value="visibility" :key=visibility>{{ $t(`@.note-visibility.${visibility}`) }}</option>
						<option value="default">{{ $t('@._settings.default-note-visibility') }}</option>
					</ui-select>					
					<!-- Hybrid -->
					<ui-select v-model="hybridNoteVisibility">
						<template #label>{{ $t('@._settings.visibility-switch-hybrid') }}</template>
						<option v-for="visibility in visibilities" :value="visibility" :key=visibility>{{ $t(`@.note-visibility.${visibility}`) }}</option>
						<option value="default">{{ $t('@._settings.default-note-visibility') }}</option>
					</ui-select>					
					<!-- Global -->
					<ui-select v-model="globalNoteVisibility">
						<template #label>{{ $t('@._settings.visibility-switch-global') }}</template>
						<option v-for="visibility in visibilities" :value="visibility" :key=visibility>{{ $t(`@.note-visibility.${visibility}`) }}</option>
						<option value="default">{{ $t('@._settings.default-note-visibility') }}</option>
					</ui-select>					
				</template>
			</section>

		</ui-card>

		<ui-card v-if="tick >= 6">
			<template #title><fa icon="volume-up"/> {{ $t('@._settings.sound') }}</template>

			<section>
				<ui-switch v-model="enableSounds">{{ $t('@._settings.enable-sounds') }}
					<template #desc>{{ $t('@._settings.enable-sounds-desc') }}</template>
				</ui-switch>
				<ui-switch :disabled="!enableSounds" v-model="enableSoundsInTimeline">{{ $t('@._settings.enable-sounds-timeline') }}
				</ui-switch>
				<ui-switch :disabled="!enableSounds" v-model="enableSoundsInNotifications">{{ $t('@._settings.enable-sounds-notifications') }}
				</ui-switch>
				<label>{{ $t('@._settings.volume') }}</label>
				<input type="range"
					v-model="soundVolume"
					:disabled="!enableSounds"
					max="1"
					step="0.1"
				/>
				<ui-button @click="soundTest"><fa icon="volume-up"/> {{ $t('@._settings.test') }}</ui-button>
			</section>
		</ui-card>

		<x-language v-if="tick >= 7"/>
		<x-app-type v-if="tick >= 8"/>
	</template>

	<template v-if="tick >= 10 && page == null || page == 'notification'">
		<x-notification/>
	</template>

	<template v-if="tick >= 11 && page == null || page == 'drive'">
		<x-drive/>
	</template>

	<template v-if="tick >= 13 && page == null || page == 'hashtags'">
		<ui-card>
			<template #title><fa icon="hashtag"/> {{ $t('@._settings.tags') }}</template>
			<section>
				<x-tags/>
			</section>
		</ui-card>
	</template>

	<template v-if="tick >= 14 && page == null || page == 'muteAndBlock'">
		<x-mute-and-block/>
	</template>

	
	<template v-if="tick >= 15 && page == null || page == 'apps'">
		<ui-card>
			<template #title><fa icon="puzzle-piece"/> {{ $t('@._settings.apps') }}</template>
			<section>
				<x-apps/>
			</section>
		</ui-card>
	</template>

	<template v-if="tick >= 16 && page == null || page == 'api'">
		<x-api/>
	</template>

	<template v-if="tick >= 17 && page == null || page == 'other'">
		<ui-card>
			<template #title><fa icon="sync-alt"/> {{ $t('@._settings.update') }}</template>
			<section>
				<p>
					<span>{{ $t('@._settings.version') }} <i>{{ version }}</i></span>
					<template v-if="latestVersion !== undefined">
						<br>
						<span>{{ $t('@._settings.latest-version') }} <i>{{ latestVersion ? latestVersion : version }}</i></span>
					</template>
				</p>
				<ui-button @click="checkForUpdate" :disabled="checkingForUpdate">
					<template v-if="checkingForUpdate">{{ $t('@._settings.update-checking') }}<mk-ellipsis/></template>
					<template v-else>{{ $t('@._settings.do-update') }}</template>
				</ui-button>
			</section>
		</ui-card>
	</template>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import i18n from '../../../../i18n';
import XApps from './apps.vue';
import XSignins from './signins.vue';
import XTags from './tags.vue';
import XTheme from './theme.vue';
import XDrive from './drive.vue';
import XMuteAndBlock from './mute-and-block.vue';
import XProfile from './profile.vue';
import XApi from './api.vue';
import XLanguage from './language.vue';
import XAppType from './app-type.vue';
import XNotification from './notification.vue';
import MkReactionPicker from '../reaction-picker.vue';

import { url, version } from '../../../../config';
import checkForUpdate from '../../../scripts/check-for-update';
import { formatTimeString } from '../../../../../../misc/format-time-string';

export default Vue.extend({
	i18n: i18n(),
	components: {
		XApps,
		XSignins,
		XTags,
		XTheme,
		XDrive,
		XMuteAndBlock,
		XProfile,
		XApi,
		XLanguage,
		XAppType,
		XNotification,
	},
	props: {
		page: {
			type: String,
			required: false,
			default: null
		}
	},
	data() {
		return {
			meta: null,
			version,
			reactions: this.$store.state.settings.reactions.join('\n'),
			webSearchEngine: this.$store.state.settings.webSearchEngine,
			pastedFileName : this.$store.state.settings.pastedFileName,
			latestVersion: undefined,
			checkingForUpdate: false,
			timeout: null,
			tick: 0,
			visibilities: [
				'public',
				'home',
				'followers',
				'specified',
				'users',
				'local-public',
				'local-home',
				'local-followers',
			],
		};
	},
	computed: {
		useOsDefaultEmojis: {
			get() { return this.$store.state.device.useOsDefaultEmojis; },
			set(value) { this.$store.commit('device/set', { key: 'useOsDefaultEmojis', value }); }
		},

		useBigCustomEmoji: {
			get() { return this.$store.state.device.useBigCustomEmoji; },
			set(value) { this.$store.commit('device/set', { key: 'useBigCustomEmoji', value }); }
		},

		reduceMotion: {
			get() { return this.$store.state.device.reduceMotion; },
			set(value) { this.$store.commit('device/set', { key: 'reduceMotion', value }); }
		},

		keepCw: {
			get() { return this.$store.state.settings.keepCw; },
			set(value) { this.$store.commit('settings/set', { key: 'keepCw', value }); }
		},

		navbar: {
			get() { return this.$store.state.device.navbar; },
			set(value) { this.$store.commit('device/set', { key: 'navbar', value }); }
		},

		enableSounds: {
			get() { return this.$store.state.device.enableSounds; },
			set(value) { this.$store.commit('device/set', { key: 'enableSounds', value }); }
		},

		enableSoundsInTimeline: {
			get() { return this.$store.state.device.enableSoundsInTimeline; },
			set(value) { this.$store.commit('device/set', { key: 'enableSoundsInTimeline', value }); }
		},

		enableSoundsInNotifications: {
			get() { return this.$store.state.device.enableSoundsInNotifications; },
			set(value) { this.$store.commit('device/set', { key: 'enableSoundsInNotifications', value }); }
		},

		enableSpeech: {
			get() { return this.$store.state.device.enableSpeech; },
			set(value) { this.$store.commit('device/set', { key: 'enableSpeech', value }); }
		},

		soundVolume: {
			get() { return this.$store.state.device.soundVolume; },
			set(value) { this.$store.commit('device/set', { key: 'soundVolume', value }); }
		},

		debug: {
			get() { return this.$store.state.device.debug; },
			set(value) { this.$store.commit('device/set', { key: 'debug', value }); }
		},

		alwaysShowNsfw: {
			get() { return this.$store.state.device.alwaysShowNsfw; },
			set(value) { this.$store.commit('device/set', { key: 'alwaysShowNsfw', value }); }
		},

		postStyle: {
			get() { return this.$store.state.device.postStyle; },
			set(value) { this.$store.commit('device/set', { key: 'postStyle', value }); }
		},

		disableViaMobile: {
			get() { return this.$store.state.settings.disableViaMobile; },
			set(value) { this.$store.dispatch('settings/set', { key: 'disableViaMobile', value }); }
		},

		useShadow: {
			get() { return this.$store.state.device.useShadow; },
			set(value) { this.$store.commit('device/set', { key: 'useShadow', value }); }
		},

		roundedCorners: {
			get() { return this.$store.state.device.roundedCorners; },
			set(value) { this.$store.commit('device/set', { key: 'roundedCorners', value }); }
		},

		lineWidth: {
			get() { return this.$store.state.device.lineWidth; },
			set(value) { this.$store.commit('device/set', { key: 'lineWidth', value }); }
		},

		fontSize: {
			get() { return this.$store.state.device.fontSize; },
			set(value) { this.$store.commit('device/set', { key: 'fontSize', value }); }
		},

		fetchOnScroll: {
			get() { return this.$store.state.settings.fetchOnScroll; },
			set(value) { this.$store.dispatch('settings/set', { key: 'fetchOnScroll', value }); }
		},

		rememberNoteVisibility: {
			get() { return this.$store.state.settings.rememberNoteVisibility; },
			set(value) { this.$store.dispatch('settings/set', { key: 'rememberNoteVisibility', value }); }
		},

		defaultNoteVisibility: {
			get() { return this.$store.state.settings.defaultNoteVisibility; },
			set(value) { this.$store.dispatch('settings/set', { key: 'defaultNoteVisibility', value }); }
		},

		useVisibilitySwitch: {
			get() { return this.$store.state.settings.useVisibilitySwitch; },
			set(value) { this.$store.dispatch('settings/set', { key: 'useVisibilitySwitch', value }); }
		},

		homeNoteVisibility: {
			get() { return this.$store.state.settings.homeNoteVisibility; },
			set(value) { this.$store.dispatch('settings/set', { key: 'homeNoteVisibility', value }); }
		},

		localNoteVisibility: {
			get() { return this.$store.state.settings.localNoteVisibility; },
			set(value) { this.$store.dispatch('settings/set', { key: 'localNoteVisibility', value }); }
		},

		hybridNoteVisibility: {
			get() { return this.$store.state.settings.hybridNoteVisibility; },
			set(value) { this.$store.dispatch('settings/set', { key: 'hybridNoteVisibility', value }); }
		},

		globalNoteVisibility: {
			get() { return this.$store.state.settings.globalNoteVisibility; },
			set(value) { this.$store.dispatch('settings/set', { key: 'globalNoteVisibility', value }); }
		},

		pasteDialog: {
			get() { return this.$store.state.settings.pasteDialog; },
			set(value) { this.$store.dispatch('settings/set', { key: 'pasteDialog', value }); }
		},

		showReplyTarget: {
			get() { return this.$store.state.settings.showReplyTarget; },
			set(value) { this.$store.dispatch('settings/set', { key: 'showReplyTarget', value }); }
		},

		showMyRenotes: {
			get() { return this.$store.state.settings.showMyRenotes; },
			set(value) { this.$store.dispatch('settings/set', { key: 'showMyRenotes', value }); }
		},

		showRenotedMyNotes: {
			get() { return this.$store.state.settings.showRenotedMyNotes; },
			set(value) { this.$store.dispatch('settings/set', { key: 'showRenotedMyNotes', value }); }
		},

		showLocalRenotes: {
			get() { return this.$store.state.settings.showLocalRenotes; },
			set(value) { this.$store.dispatch('settings/set', { key: 'showLocalRenotes', value }); }
		},

		showPostFormOnTopOfTl: {
			get() { return this.$store.state.settings.showPostFormOnTopOfTl; },
			set(value) { this.$store.dispatch('settings/set', { key: 'showPostFormOnTopOfTl', value }); }
		},

		suggestRecentHashtags: {
			get() { return this.$store.state.settings.suggestRecentHashtags; },
			set(value) { this.$store.dispatch('settings/set', { key: 'suggestRecentHashtags', value }); }
		},

		circleIcons: {
			get() { return this.$store.state.settings.circleIcons; },
			set(value) {
				this.$store.dispatch('settings/set', { key: 'circleIcons', value });
				this.reload();
			}
		},

		contrastedAcct: {
			get() { return this.$store.state.settings.contrastedAcct; },
			set(value) {
				this.$store.dispatch('settings/set', { key: 'contrastedAcct', value });
				this.reload();
			}
		},

		showFullAcct: {
			get() { return this.$store.state.settings.showFullAcct; },
			set(value) {
				this.$store.dispatch('settings/set', { key: 'showFullAcct', value });
				this.reload();
			}
		},

		showVia: {
			get() { return this.$store.state.settings.showVia; },
			set(value) { this.$store.dispatch('settings/set', { key: 'showVia', value }); }
		},

		disableAnimatedMfm: {
			get() { return this.$store.state.settings.disableAnimatedMfm; },
			set(value) { this.$store.dispatch('settings/set', { key: 'disableAnimatedMfm', value }); }
		},

		disableShowingAnimatedImages: {
			get() { return this.$store.state.device.disableShowingAnimatedImages; },
			set(value) { this.$store.commit('device/set', { key: 'disableShowingAnimatedImages', value }); }
		},

		remainDeletedNote: {
			get() { return this.$store.state.settings.remainDeletedNote; },
			set(value) { this.$store.dispatch('settings/set', { key: 'remainDeletedNote', value }); }
		},

		mobileNotificationPosition: {
			get() { return this.$store.state.device.mobileNotificationPosition; },
			set(value) { this.$store.commit('device/set', { key: 'mobileNotificationPosition', value }); }
		},

		enableMobileQuickNotificationView: {
			get() { return this.$store.state.device.enableMobileQuickNotificationView; },
			set(value) { this.$store.commit('device/set', { key: 'enableMobileQuickNotificationView', value }); }
		},

		homeProfile: {
			get() { return this.$store.state.device.homeProfile; },
			set(value) { this.$store.commit('device/set', { key: 'homeProfile', value }); }
		},

		mobileHomeProfile: {
			get() { return this.$store.state.device.mobileHomeProfile; },
			set(value) { this.$store.commit('device/set', { key: 'mobileHomeProfile', value }); }
		},
	},
	created() {
		this.$root.getMeta().then(meta => {
			this.meta = meta;
		});
		this.timeout = setInterval(() => {
			this.tick++;
			if (this.tick > 19) {
				clearInterval(this.timeout);
			}
		}, 50);
	},
	methods: {
		reload() {
			this.$root.dialog({
				type: 'warning',
				text: this.$t('@.reload-to-apply-the-setting'),
				showCancelButton: true
			}).then(({ canceled }) => {
				if (!canceled) {
					location.reload();
				}
			});
		},
		save(key, value) {
			this.$store.dispatch('settings/set', {
				key,
				value
			}).then(() => {
				this.$root.dialog({
					type: 'success',
					text: this.$t('@._settings.saved')
				})
			});
		},
		customizeHome() {
			location.href = '/?customize';
		},
		updateWallpaper() {
			this.$chooseDriveFile({
				multiple: false
			}).then(file => {
				this.$store.dispatch('settings/set', { key: 'wallpaper', value: file.url });
			});
		},
		deleteWallpaper() {
			this.$store.dispatch('settings/set', { key: 'wallpaper', value: null });
		},
		checkForUpdate() {
			this.checkingForUpdate = true;
			checkForUpdate(this.$root, true, true).then(newer => {
				this.checkingForUpdate = false;
				this.latestVersion = newer;
				if (newer == null) {
					this.$root.dialog({
						title: this.$t('@._settings.no-updates'),
						text: this.$t('@._settings.no-updates-desc')
					});
				} else {
					this.$root.dialog({
						title: this.$t('@._settings.update-available'),
						text: this.$t('@._settings.update-available-desc')
					});
				}
			});
		},
		soundTest() {
			const sound = new Audio(`${url}/assets/message.mp3`);
			sound.volume = this.$store.state.device.soundVolume;
			sound.play();
		},
		pastedFileNamePreview() {
			return `${formatTimeString(new Date(), this.pastedFileName).replace(/{{number}}/g, `1`)}.png`
		},
		previewReaction() {
			const picker = this.$root.new(MkReactionPicker, {
				source: this.$refs.reactionsPreviewButton.$el,
				reactions: this.reactions.trim().split('\n'),
				showFocus: false,
			});
			picker.$once('chosen', reaction => {
				picker.close();
			});
		}
	}
});
</script>
