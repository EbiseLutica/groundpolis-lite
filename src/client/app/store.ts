import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import * as nestedProperty from 'nested-property';

import MiOS from './mios';
import getNoteSummary from '../../misc/get-note-summary';

const defaultSettings = {
	keepCw: false,
	tagTimelines: [],
	fetchOnScroll: true,
	remainDeletedNote: false,
	showPostFormOnTopOfTl: false,
	suggestRecentHashtags: true,
	circleIcons: true,
	contrastedAcct: true,
	showFullAcct: false,
	showVia: true,
	showReplyTarget: true,
	showMyRenotes: true,
	showRenotedMyNotes: true,
	showLocalRenotes: true,
	loadRemoteMedia: true,
	disableViaMobile: false,
	memo: null,
	rememberNoteVisibility: false,
	useVisibilitySwitch: false,
	defaultNoteVisibility: 'public',
	homeNoteVisibility: 'default',
	localNoteVisibility: 'default',
	hybridNoteVisibility: 'default',
	globalNoteVisibility: 'default',
	wallpaper: null,
	webSearchEngine: 'https://www.google.com/?#q={{query}}',
	mutedWords: [],
	disableAnimatedMfm: false,
	homeProfiles: {},
	mobileHomeProfiles: {},
	uploadFolder: null,
	reactions: ['like', 'love', 'laugh', 'hmm', 'surprise', 'congrats', 'angry', 'confused', 'rip', 'pudding']
};

const defaultDeviceSettings = {
	homeProfile: 'Default',
	mobileHomeProfile: 'Default',
	useShadow: false,
	roundedCorners: true,
	reduceMotion: false,
	darkmode: true,
	darkTheme: 'dark',
	lightTheme: 'light',
	lineWidth: 1,
	fontSize: 0,
	themes: [],
	enableSounds: true,
	enableSoundsInTimeline: false,
	enableSoundsInNotifications: true,
	soundVolume: 0.5,
	mediaVolume: 0.5,
	enableSpeech: false,
	lang: null,
	appTypeForce: 'auto',
	debug: false,
	lightmode: false,
	loadRawImages: false,
	alwaysShowNsfw: false,
	postStyle: 'standard',
	navbar: 'top',
	mobileNotificationPosition: 'bottom',
	useOsDefaultEmojis: false,
	useBigCustomEmoji: true,
	disableShowingAnimatedImages: false,
	expandUsersPhotos: true,
	expandUsersActivity: true,
	showPostPreview: true,
	enableMobileQuickNotificationView: false,
	activeEmojiCategoryName: undefined,
	recentEmojis: [],
};

export default (os: MiOS) => new Vuex.Store({
	plugins: [createPersistedState({
		paths: ['i', 'device', 'settings']
	})],

	state: {
		i: null,
		indicate: false,
		uiHeaderHeight: 0,
		behindNotes: []
	},

	getters: {
		isSignedIn: state => state.i != null,

		home: state => state.settings.homeProfiles[state.device.homeProfile],

		mobileHome: state => state.settings.mobileHomeProfiles[state.device.mobileHomeProfile],
	},

	mutations: {
		updateI(state, x) {
			state.i = x;
		},

		updateIKeyValue(state, x) {
			state.i = { ...state.i, [x.key]: x.value };
		},

		indicate(state, x) {
			state.indicate = x;
		},

		setUiHeaderHeight(state, height) {
			state.uiHeaderHeight = height;
		},

		pushBehindNote(state, note) {
			if (note.userId === state.i.id) return;
			if (state.behindNotes.some(n => n.id === note.id)) return;
			state.behindNotes.push(note);
			document.title = `(${state.behindNotes.length}) ${getNoteSummary(note)}`;
		},

		clearBehindNotes(state) {
			state.behindNotes = [];
			document.title = os.instanceName;
		},

		setHome(state, data) {
			Vue.set(state.settings.homeProfiles, state.device.homeProfile, data);
			os.store.dispatch('settings/updateHomeProfile');
		},

		addHomeWidget(state, widget) {
			state.settings.homeProfiles[state.device.homeProfile].unshift(widget);
			os.store.dispatch('settings/updateHomeProfile');
		},

		setMobileHome(state, data) {
			Vue.set(state.settings.mobileHomeProfiles, state.device.mobileHomeProfile, data);
			os.store.dispatch('settings/updateMobileHomeProfile');
		},

		updateWidget(state, x) {
			let w;

			//#region Desktop home
			const home = state.settings.homeProfiles[state.device.homeProfile];
			if (home) {
				w = home.find(w => w.id == x.id);
				if (w) {
					w.data = x.data;
					os.store.dispatch('settings/updateHomeProfile');
				}
			}
			//#endregion

			//#region Mobile home
			const mobileHome = state.settings.mobileHomeProfiles[state.device.mobileHomeProfile];
			if (mobileHome) {
				w = mobileHome.find(w => w.id == x.id);
				if (w) {
					w.data = x.data;
					os.store.dispatch('settings/updateMobileHomeProfile');
				}
			}
			//#endregion
		},

		addMobileHomeWidget(state, widget) {
			state.settings.mobileHomeProfiles[state.device.mobileHomeProfile].unshift(widget);
			os.store.dispatch('settings/updateMobileHomeProfile');
		},

		removeMobileHomeWidget(state, widget) {
			Vue.set('state.settings.mobileHomeProfiles', state.device.mobileHomeProfile, state.settings.mobileHomeProfiles[state.device.mobileHomeProfile].filter(w => w.id != widget.id));
			os.store.dispatch('settings/updateMobileHomeProfile');
		},
	},

	actions: {
		login(ctx, i) {
			ctx.commit('updateI', i);
			ctx.dispatch('settings/merge', i.clientData);
		},

		logout(ctx) {
			ctx.commit('updateI', null);
			document.cookie = `i=; max-age=0; domain=${document.location.hostname}`;
			localStorage.removeItem('i');
		},

		mergeMe(ctx, me) {
			for (const [key, value] of Object.entries(me)) {
				ctx.commit('updateIKeyValue', { key, value });
			}

			if (me.clientData) {
				ctx.dispatch('settings/merge', me.clientData);
			}
		},
	},

	modules: {
		device: {
			namespaced: true,

			state: defaultDeviceSettings,

			mutations: {
				set(state, x: { key: string; value: any }) {
					state[x.key] = x.value;
				},

				setTl(state, x) {
					state.tl = {
						src: x.src,
						arg: x.arg
					};
				},

				setVisibility(state, visibility) {
					state.visibility = visibility;
				},
			}
		},

		settings: {
			namespaced: true,

			state: defaultSettings,

			mutations: {
				set(state, x: { key: string; value: any }) {
					nestedProperty.set(state, x.key, x.value);
				},
			},

			actions: {
				merge(ctx, settings) {
					if (settings == null) return;
					for (const [key, value] of Object.entries(settings)) {
						ctx.commit('set', { key, value });
					}
				},

				set(ctx, x) {
					ctx.commit('set', x);

					if (ctx.rootGetters.isSignedIn) {
						os.api('i/update-client-setting', {
							name: x.key,
							value: x.value
						});
					}
				},

				updateHomeProfile(ctx) {
					const profiles = ctx.state.homeProfiles;
					ctx.commit('set', {
						key: 'homeProfiles',
						value: profiles
					});
					os.api('i/update-client-setting', {
						name: 'homeProfiles',
						value: profiles
					});
				},

				updateMobileHomeProfile(ctx) {
					const profiles = ctx.state.mobileHomeProfiles;
					ctx.commit('set', {
						key: 'mobileHomeProfiles',
						value: profiles
					});
					os.api('i/update-client-setting', {
						name: 'mobileHomeProfiles',
						value: profiles
					});
				},
			}
		}
	}
});
