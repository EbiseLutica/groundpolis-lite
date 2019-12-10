/**
 * Mobile Client
 */

import Vue from 'vue';
import VueRouter from 'vue-router';

// Style
import './style.styl';

import init from '../init';

import MkIndex from './views/pages/index.vue';
import MkSignup from './views/pages/signup.vue';
import MkExplore from './views/pages/explore.vue';
import MkSelectDrive from './views/pages/selectdrive.vue';
import MkDrive from './views/pages/drive.vue';
import MkNotifications from './views/pages/notifications.vue';
import MkNote from './views/pages/note.vue';
import MkSearch from './views/pages/search.vue';
import UI from './views/pages/ui.vue';
import MkTag from './views/pages/tag.vue';
import MkShare from '../common/views/pages/share.vue';
import MkFollow from '../common/views/pages/follow.vue';
import MkNotFound from '../common/views/pages/not-found.vue';
import PostFormDialog from './views/components/post-form-dialog.vue';

import FileChooser from './views/components/drive-file-chooser.vue';
import FolderChooser from './views/components/drive-folder-chooser.vue';

import updateUserImage from './api/update-user-image';

/**
 * init
 */
init((launch, os) => {
	Vue.mixin({
		data() {
			return {
				isMobile: true
			};
		},

		methods: {
			$post(opts) {
				const o = opts || {};

				document.documentElement.style.overflow = 'hidden';

				function recover() {
					document.documentElement.style.overflow = 'auto';
				}

				const vm = this.$root.new(PostFormDialog, {
					reply: o.reply,
					mention: o.mention,
					renote: o.renote,
					initialText: o.initialText,
					instant: o.instant,
					initialNote: o.initialNote,
				});
				vm.$once('cancel', recover);
				vm.$once('posted', recover);
				if (o.cb) vm.$once('closed', o.cb);
				(vm as any).focus();
			},

			$chooseDriveFile(opts) {
				return new Promise((res, rej) => {
					const o = opts || {};
					const vm = this.$root.new(FileChooser, {
						title: o.title,
						multiple: o.multiple,
						initFolder: o.currentFolder
					});
					vm.$once('selected', file => {
						res(file);
					});
				});
			},

			$chooseDriveFolder(opts) {
				return new Promise((res, rej) => {
					const o = opts || {};
					const vm = this.$root.new(FolderChooser, {
						title: o.title,
						initFolder: o.currentFolder
					});
					vm.$once('selected', folder => {
						res(folder);
					});
				});
			},

			$notify(message) {
				alert(message);
			},

			$updateAvatar(file) {
				return updateUserImage(this, 'avatar')(file);
			},

			$updateBanner(file) {
				return updateUserImage(this, 'banner')(file);
			},
		}
	});

	// Register directives
	require('./views/directives');

	// Register components
	require('./views/components');
	require('./views/widgets');

	// http://qiita.com/junya/items/3ff380878f26ca447f85
	document.body.setAttribute('ontouchstart', '');

	// Init router
	const router = new VueRouter({
		mode: 'history',
		routes: [
			{ path: '/', name: 'index', component: MkIndex },
			{ path: '/signup', name: 'signup', component: MkSignup },
			{ path: '/i/settings', name: 'settings', component: () => import('./views/pages/settings.vue').then(m => m.default) },
			{ path: '/i/settings/:page', redirect: '/i/settings' },
			{ path: '/i/favorites', name: 'favorites', component: UI, props: route => ({ component: () => import('../common/views/pages/favorites.vue').then(m => m.default), platform: 'mobile' }) },
			{ path: '/i/lists', name: 'user-lists', component: UI, props: route => ({ component: () => import('../common/views/pages/user-lists.vue').then(m => m.default) }) },
			{ path: '/i/lists/:list', component: UI, props: route => ({ component: () => import('../common/views/pages/user-list-editor.vue').then(m => m.default), listId: route.params.list }) },
			{ path: '/i/follow-requests', name: 'follow-requests', component: UI, props: route => ({ component: () => import('../common/views/pages/follow-requests.vue').then(m => m.default) }) },
			{ path: '/i/widgets', name: 'widgets', component: () => import('./views/pages/widgets.vue').then(m => m.default) },
			{ path: '/i/notifications', name: 'notifications', component: MkNotifications },
			{ path: '/i/drive', name: 'drive', component: MkDrive },
			{ path: '/i/drive/folder/:folder', component: MkDrive },
			{ path: '/i/drive/file/:file', component: MkDrive },
			{ path: '/selectdrive', component: MkSelectDrive },
			{ path: '/search', component: MkSearch },
			{ path: '/tags/:tag', component: MkTag },
			{ path: '/featured', name: 'featured', component: UI, props: route => ({ component: () => import('../common/views/pages/featured.vue').then(m => m.default), platform: 'mobile' }) },
			{ path: '/explore', name: 'explore', component: MkExplore},
			{ path: '/explore/tags/:tag', name: 'explore-tag', component: UI, props: route => ({ component: () => import('../common/views/pages/explore.vue').then(m => m.default), tag: route.params.tag }) },
			{ path: '/share', component: MkShare },
			{ path: '/@:user', name: 'user', component: () => import('./views/pages/user/index.vue').then(m => m.default), children: [
				{ path: 'following', component: () => import('../common/views/pages/following.vue').then(m => m.default) },
				{ path: 'followers', component: () => import('../common/views/pages/followers.vue').then(m => m.default) },
			]},
			{ path: '/notes/:note', component: MkNote },
			{ path: '/authorize-follow', component: MkFollow },
			{ path: '*', component: MkNotFound }
		]
	});

	// Launch the app
	launch(router);
}, true);
