import * as Koa from 'koa';
import * as bcrypt from 'bcryptjs';
import * as speakeasy from 'speakeasy';
import signin from '../common/signin';
import config from '../../../config';
import { Users, Signins, UserProfiles } from '../../../models';
import { ILocalUser } from '../../../models/entities/user';
import { genId } from '../../../misc/gen-id';
import { ensure } from '../../../prelude/ensure';

export default async (ctx: Koa.Context) => {
	ctx.set('Access-Control-Allow-Origin', config.url);
	ctx.set('Access-Control-Allow-Credentials', 'true');

	const body = ctx.request.body as any;
	const username = body['username'];
	const password = body['password'];
	const token = body['token'];

	if (typeof username != 'string') {
		ctx.status = 400;
		return;
	}

	if (typeof password != 'string') {
		ctx.status = 400;
		return;
	}

	if (token != null && typeof token != 'string') {
		ctx.status = 400;
		return;
	}

	// Fetch user
	const user = await Users.findOne({
		usernameLower: username.toLowerCase(),
		host: null
	}) as ILocalUser;

	if (user == null) {
		ctx.throw(404, {
			error: 'user not found'
		});
		return;
	}

	const profile = await UserProfiles.findOne(user.id).then(ensure);

	// Compare password
	const same = await bcrypt.compare(password, profile.password!);

	async function fail(status?: number, failure?: { error: string }) {
		// Append signin history
		await Signins.save({
			id: genId(),
			createdAt: new Date(),
			userId: user.id,
			ip: ctx.ip,
			headers: ctx.headers,
			success: false
		});

		ctx.throw(status || 500, failure || { error: 'someting happened' });
	}

	if (!profile.twoFactorEnabled) {
		if (same) {
			signin(ctx, user);
			return;
		} else {
			await fail(403, {
				error: 'incorrect password'
			});
			return;
		}
	}

	if (!same) {
		await fail(403, {
			error: 'incorrect password'
		});
		return;
	}

	const verified = (speakeasy as any).totp.verify({
		secret: profile.twoFactorSecret,
		encoding: 'base32',
		token: token
	});

	if (verified) {
		signin(ctx, user);
		return;
	} else {
		await fail(403, {
			error: 'invalid token'
		});
		return;
	}
	// never get here
};
