<template>
<ui-card>
	<template #title><fa icon="cloud"/> {{ $t('@.drive') }}</template>

	<section v-if="!fetching" class="juakhbxthdewydyreaphkepoxgxvfogn">
		<div class="meter"><div :style="meterStyle"></div></div>
		<p>{{ $t('max') }}: <b>{{ capacity | bytes }}</b> {{ $t('in-use') }}: <b>{{ usage | bytes }}</b></p>
	</section>

	<section>
		<header>{{ $t('default-upload-folder') }}</header>
		<ui-input v-model="uploadFolderName" readonly>{{ $t('default-upload-folder-name') }}</ui-input>
		<ui-button @click="chooseUploadFolder()">{{ $t('change-default-upload-folder') }}</ui-button>
	</section>
</ui-card>
</template>

<script lang="ts">
import Vue from 'vue';
import i18n from '../../../../i18n';
import * as tinycolor from 'tinycolor2';

export default Vue.extend({
	i18n: i18n('common/views/components/drive-settings.vue'),
	data() {
		return {
			fetching: true,
			usage: null,
			capacity: null,
			uploadFolderName: null
		};
	},

	computed: {
		meterStyle(): any {
			return {
				width: `${this.usage / this.capacity * 100}%`,
				background: tinycolor({
					h: 180 - (this.usage / this.capacity * 180),
					s: 0.7,
					l: 0.5
				})
			};
		},

		uploadFolder: {
			get() { return this.$store.state.settings.uploadFolder; },
			set(value) { this.$store.dispatch('settings/set', { key: 'uploadFolder', value }); }
		},
	},

	mounted() {
		if (this.uploadFolder == null) {
			this.uploadFolderName = this.$t('@._settings.root');
		} else {
			this.$root.api('drive/folders/show', {
				folderId: this.uploadFolder
			}).then(folder => {
				this.uploadFolderName = folder.name;
			});
		}
	
		this.$root.api('drive').then(info => {
			this.capacity = info.capacity;
			this.usage = info.usage;
			this.fetching = false;
		});
	},

	methods: {
		chooseUploadFolder() {
			this.$chooseDriveFolder().then(folder => {
				this.uploadFolder = folder ? folder.id : null;
				this.uploadFolderName = folder ? folder.name : this.$t('@._settings.root');
			})
		}
	}
});
</script>

<style lang="stylus" scoped>
.juakhbxthdewydyreaphkepoxgxvfogn
	> .meter
		$size = 12px

		margin-bottom 16px
		background rgba(0, 0, 0, 0.1)
		border-radius ($size / 2)
		overflow hidden

		> div
			height $size
			border-radius ($size / 2)

	> p
		margin 0

</style>
