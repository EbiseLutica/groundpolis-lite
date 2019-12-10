import $ from 'cafy';
import * as os from 'os';
import config from '../../../config';
import define from '../define';
import { fetchMeta } from '../../../misc/fetch-meta';
import { Emojis } from '../../../models';
import { getConnection } from 'typeorm';
import redis from '../../../db/redis';
import { DB_MAX_NOTE_TEXT_LENGTH } from '../../../misc/hard-limits';

export const meta = {
	stability: 'stable',

	desc: {
		'ja-JP': 'インスタンス情報を取得します。',
		'en-US': 'Get the information of this instance.'
	},

	tags: ['meta'],

	requireCredential: false,

	params: {
		detail: {
			validator: $.optional.bool,
			default: true
		}
	},

	res: {
		type: 'object' as const,
		optional: false as const, nullable: false as const,
		properties: {
			version: {
				type: 'string' as const,
				optional: false as const, nullable: false as const,
				description: 'The version of Groundpolis of this instance.',
				example: config.version
			},
			name: {
				type: 'string' as const,
				optional: false as const, nullable: false as const,
				description: 'The name of this instance.',
			},
			description: {
				type: 'string' as const,
				optional: false as const, nullable: false as const,
				description: 'The description of this instance.',
			},
			announcements: {
				type: 'array' as const,
				optional: false as const, nullable: false as const,
				items: {
					type: 'object' as const,
					optional: false as const, nullable: false as const,
					properties: {
						title: {
							type: 'string' as const,
							optional: false as const, nullable: false as const,
							description: 'The title of the announcement.',
						},
						text: {
							type: 'string' as const,
							optional: false as const, nullable: false as const,
							description: 'The text of the announcement. (can be HTML)',
						},
					}
				},
				description: 'The announcements of this instance.',
			},
			disableRegistration: {
				type: 'boolean' as const,
				optional: false as const, nullable: false as const,
				description: 'Whether disabled open registration.',
			},
			disableLocalTimeline: {
				type: 'boolean' as const,
				optional: false as const, nullable: false as const,
				description: 'Whether disabled LTL and STL.',
			},
			disableGlobalTimeline: {
				type: 'boolean' as const,
				optional: false as const, nullable: false as const,
				description: 'Whether disabled GTL.',
			},
			enableEmojiReaction: {
				type: 'boolean' as const,
				optional: false as const, nullable: false as const,
				description: 'Whether enabled emoji reaction.',
			},
			hideServerInformation: {
				type: 'boolean' as const,
				optional: false as const, nullable: false as const,
				description: 'Whether server information is hidden.',
			},
		}
	}
};

export default define(meta, async (ps, me) => {
	const instance = await fetchMeta(true);

	const emojis = await Emojis.find({
		where: {
			host: null
		},
		order: {
			category: 'ASC',
			name: 'ASC'
		},
		cache: {
			id: 'meta_emojis',
			milliseconds: 3600000	// 1 hour
		}
	});

	const hide = instance.hideServerInformation;

	const response: any = {
		maintainerName: instance.maintainerName,
		maintainerEmail: instance.maintainerEmail,

		version: config.version,

		name: instance.name,
		uri: config.url,
		description: instance.description,
		langs: instance.langs,
		ToSUrl: instance.ToSUrl,
		repositoryUrl: instance.repositoryUrl,
		feedbackUrl: instance.feedbackUrl,

		secure: config.https != null,
		machine: hide ? undefined : os.hostname(),
		os: hide ? undefined : os.platform(),
		node: hide ? undefined : process.version,
		psql: hide ? undefined : await getConnection().query('SHOW server_version').then(x => x[0].server_version),
		redis: hide ? undefined : redis.server_info.redis_version,

		cpu: hide ? undefined : {
			model: os.cpus()[0].model,
			cores: os.cpus().length
		},

		announcements: instance.announcements || [],
		disableRegistration: instance.disableRegistration,
		disableLocalTimeline: instance.disableLocalTimeline,
		disableGlobalTimeline: instance.disableGlobalTimeline,
		enableEmojiReaction: instance.enableEmojiReaction,
		driveCapacityPerLocalUserMb: instance.localDriveCapacityMb,
		driveCapacityPerPremiumUserMb: instance.premiumDriveCapacityMb,
		driveCapacityPerRemoteUserMb: instance.remoteDriveCapacityMb,
		cacheRemoteFiles: instance.cacheRemoteFiles,
		enableRecaptcha: instance.enableRecaptcha,
		recaptchaSiteKey: instance.recaptchaSiteKey,
		swPublickey: instance.swPublicKey,
		mascotImageUrl: instance.mascotImageUrl,
		bannerUrl: instance.bannerUrl,
		errorImageUrl: instance.errorImageUrl,
		iconUrl: instance.iconUrl,
		maxNoteTextLength: Math.min(instance.maxNoteTextLength, DB_MAX_NOTE_TEXT_LENGTH),
		emojis: emojis.map(e => ({
			id: e.id,
			aliases: e.aliases,
			name: e.name,
			category: e.category,
			url: e.url,
		})),
		enableEmail: instance.enableEmail,

		enableServiceWorker: instance.enableServiceWorker,

		hideServerInformation: hide,
	};

	if (ps.detail) {
		response.features = {
			registration: !instance.disableRegistration,
			localTimeLine: !instance.disableLocalTimeline,
			globalTimeLine: !instance.disableGlobalTimeline,
			elasticsearch: config.elasticsearch ? true : false,
			recaptcha: instance.enableRecaptcha,
			objectStorage: instance.useObjectStorage,
			serviceWorker: instance.enableServiceWorker,
		};
	}

	if (me && (me.isAdmin || me.isModerator)) {
		response.useStarForReactionFallback = instance.useStarForReactionFallback;
		response.pinnedUsers = instance.pinnedUsers;
		response.hiddenTags = instance.hiddenTags;
		response.blockedHosts = instance.blockedHosts;
		response.recaptchaSecretKey = instance.recaptchaSecretKey;
		response.proxyAccount = instance.proxyAccount;
		response.twitterConsumerKey = instance.twitterConsumerKey;
		response.twitterConsumerSecret = instance.twitterConsumerSecret;
		response.githubClientId = instance.githubClientId;
		response.githubClientSecret = instance.githubClientSecret;
		response.discordClientId = instance.discordClientId;
		response.discordClientSecret = instance.discordClientSecret;
		response.summalyProxy = instance.summalyProxy;
		response.email = instance.email;
		response.smtpSecure = instance.smtpSecure;
		response.smtpHost = instance.smtpHost;
		response.smtpPort = instance.smtpPort;
		response.smtpUser = instance.smtpUser;
		response.smtpPass = instance.smtpPass;
		response.swPrivateKey = instance.swPrivateKey;
		response.useObjectStorage = instance.useObjectStorage;
		response.objectStorageBaseUrl = instance.objectStorageBaseUrl;
		response.objectStorageBucket = instance.objectStorageBucket;
		response.objectStoragePrefix = instance.objectStoragePrefix;
		response.objectStorageEndpoint = instance.objectStorageEndpoint;
		response.objectStorageRegion = instance.objectStorageRegion;
		response.objectStoragePort = instance.objectStoragePort;
		response.objectStorageAccessKey = instance.objectStorageAccessKey;
		response.objectStorageSecretKey = instance.objectStorageSecretKey;
		response.objectStorageUseSSL = instance.objectStorageUseSSL;
	}

	return response;
});
