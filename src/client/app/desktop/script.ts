/**
 * Desktop Client
 */

import Vue from 'vue';
import VueRouter from 'vue-router';

// Style
import './style.styl';

import init from '../init';
import composeNotification from '../common/scripts/compose-notification';

import MkHome from './views/home/home.vue';
import MkSelectDrive from './views/pages/selectdrive.vue';
import MkDrive from './views/pages/drive.vue';
import MkShare from '../common/views/pages/share.vue';
import MkFollow from '../common/views/pages/follow.vue';
import MkNotFound from '../common/views/pages/not-found.vue';
import MkSettings from './views/pages/settings.vue';

import Ctx from './views/components/context-menu.vue';
import RenoteFormWindow from './views/components/renote-form-window.vue';
import MkChooseFileFromDriveWindow from './views/components/choose-file-from-drive-window.vue';
import MkChooseFolderFromDriveWindow from './views/components/choose-folder-from-drive-window.vue';
import MkHomeTimeline from './views/home/timeline.vue';
import Notification from './views/components/ui-notification.vue';

import updateUserImage from './api/update-user-image';

import { url } from '../config';
import MiOS from '../mios';

/**
 * init
 */
init(async (launch, os) => {
	Vue.mixin({
		methods: {
			$contextmenu(e, menu, opts?) {
				const o = opts || {};
				const vm = this.$root.new(Ctx, {
					menu,
					x: e.pageX - window.pageXOffset,
					y: e.pageY - window.pageYOffset,
				});
				vm.$once('closed', () => {
					if (o.closed) o.closed();
				});
			},

			$post(opts) {
				const o = opts || {};
				if (o.renote) {
					const vm = this.$root.new(RenoteFormWindow, {
						note: o.renote,
						animation: o.animation == null ? true : o.animation
					});
					if (o.cb) vm.$once('closed', o.cb);
				} else {
					this.$root.newAsync(() => import('./views/components/post-form-window.vue').then(m => m.default), {
						reply: o.reply,
						mention: o.mention,
						animation: o.animation == null ? true : o.animation,
						initialText: o.initialText,
						instant: o.instant,
						initialNote: o.initialNote,
					}).then(vm => {
						if (o.cb) vm.$once('closed', o.cb);
					});
				}
			},

			$chooseDriveFile(opts) {
				return new Promise((res, rej) => {
					const o = opts || {};

					if (document.body.clientWidth > 800) {
						const w = this.$root.new(MkChooseFileFromDriveWindow, {
							title: o.title,
							type: o.type,
							multiple: o.multiple,
							initFolder: o.currentFolder
						});
						w.$once('selected', file => {
							res(file);
						});
					} else {
						window['cb'] = file => {
							res(file);
						};

						window.open(url + `/selectdrive?multiple=${o.multiple}`,
							'choose_drive_window',
							'height=500, width=800');
					}
				});
			},

			$chooseDriveFolder(opts) {
				return new Promise((res, rej) => {
					const o = opts || {};
					const w = this.$root.new(MkChooseFolderFromDriveWindow, {
						title: o.title,
						initFolder: o.currentFolder
					});
					w.$once('selected', folder => {
						res(folder);
					});
				});
			},

			$notify(message) {
				this.$root.new(Notification, {
					message
				});
			},

			$updateAvatar(file) {
				return updateUserImage(this, 'avatar')(file)
			},

			$updateBanner(file) {
				return updateUserImage(this, 'banner')(file)
			}
		}
	});

	// Register directives
	require('./views/directives');

	// Register components
	require('./views/components');
	require('./views/widgets');

	// Init router
	const router = new VueRouter({
		mode: 'history',
		routes: [
				{ path: '/', component: MkHome, children: [
				{ path: '', name: 'index', component: MkHomeTimeline },
				{ path: '/@:user', component: () => import('./views/home/user/index.vue').then(m => m.default), children: [
					{ path: '', name: 'user', component: () => import('./views/home/user/user.home.vue').then(m => m.default) },
					{ path: 'following', name: 'user', component: () => import('../common/views/pages/following.vue').then(m => m.default) },
					{ path: 'followers', name: 'user', component: () => import('../common/views/pages/followers.vue').then(m => m.default) },
				]},
				{ path: '/notes/:note', name: 'note', component: () => import('./views/home/note.vue').then(m => m.default) },
				{ path: '/search', component: () => import('./views/home/search.vue').then(m => m.default) },
				{ path: '/tags/:tag', name: 'tag', component: () => import('./views/home/tag.vue').then(m => m.default) },
				{ path: '/featured', name: 'featured', component: () => import('../common/views/pages/featured.vue').then(m => m.default), props: { platform: 'desktop' } },
				{ path: '/explore', name: 'explore', component: () => import('./views/pages/explore.vue').then(m => m.default) },
				{ path: '/explore/tags/:tag', name: 'explore-tag', props: true, component: () => import('./views/pages/explore.vue').then(m => m.default) },
				{ path: '/i/favorites', name: 'favorites', component: () => import('../common/views/pages/favorites.vue').then(m => m.default), props: { platform: 'desktop' } },
				{ path: '/i/lists', name: 'lists', component: () => import('../common/views/pages/user-lists.vue').then(m => m.default) },
				{ path: '/i/lists/:listId', props: true, component: () => import('../common/views/pages/user-list-editor.vue').then(m => m.default) },
				{ path: '/i/follow-requests', name: 'follow-requests', component: () => import('../common/views/pages/follow-requests.vue').then(m => m.default) },
				{ path: '/i/drive', name: 'drive', component: MkDrive },
				{ path: '/i/drive/folder/:folder', component: MkDrive },
				{ path: '/i/settings', name: 'settings', redirect: '/i/settings/profile' },
				{ path: '/notifications', name: 'notifications', component: () => import('./views/home/notifications.vue').then(m => m.default) },
				{ path: '/i/settings/:page', name: 'settings', component: MkSettings },
			]},
			{ path: '/selectdrive', component: MkSelectDrive },
			{ path: '/share', component: MkShare },
			{ path: '/authorize-follow', component: MkFollow },
			{ path: '*', component: MkNotFound }
		],
		scrollBehavior(to, from, savedPosition) {
			return { x: 0, y: 0 };
		}
	});

	// Launch the app
	const [app, _] = launch(router);

	/**
	 * Init Notification
	 */
	if ('Notification' in window && os.store.getters.isSignedIn) {
		// 許可を得ていなかったらリクエスト
		if ((Notification as any).permission == 'default') {
			await Notification.requestPermission();
		}

		if ((Notification as any).permission == 'granted') {
			registerNotifications(os);
		}
	}
}, true);

function registerNotifications(os: MiOS) {
	const stream = os.stream;

	if (stream == null) return;

	const connection = stream.useSharedConnection('main');

	connection.on('notification', notification => {
		const _n = composeNotification('notification', notification);
		const n = new Notification(_n.title, {
			body: _n.body,
			icon: _n.icon
		});
		setTimeout(n.close.bind(n), 6000);
	});

	connection.on('driveFileCreated', file => {
		const _n = composeNotification('driveFileCreated', file);
		const n = new Notification(_n.title, {
			body: _n.body,
			icon: _n.icon
		});
		setTimeout(n.close.bind(n), 5000);
	});
}
