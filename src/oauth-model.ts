import moment from 'moment';
import { OAuthError } from 'oauth2-server';
import { getRepository } from 'typeorm';
import { User } from './entity/user.entity';
import { OAuthAccessToken } from './entity/oauth_access_token.entity';
import { OAuthRefreshToken } from './entity/oauth_refresh_token.entity';
import { OAuthClient } from './entity/oauth_client.entity';
const getAccessToken = async (accessToken) => {
  try {
    const OAuthAccessTokenRepository = getRepository(OAuthAccessToken);
    const accessTokenResult = await OAuthAccessTokenRepository.findOne({
      where: { access_token: accessToken },
      relations: ['user', 'client'],
    });

    if (!accessTokenResult) return false;

    const { access_token, expires, scope, client, user } = accessTokenResult;

    return {
      accessToken: access_token,
      accessTokenExpiresAt: expires,
      scope: scope,
      client: client,
      user: user,
    };
  } catch (e) {
    return false;
  }
};

const getUser = async (email, password) => {
  const userRepository = getRepository(User);
  const userResult = await userRepository.findOne({
    where: {
      email,
    },
  });

  if (!userResult || !(await userResult.validatePassword(password))) {
    throw new OAuthError('Invalid Email or Password', { code: 400 });
  }

  return userResult;
};

const saveToken = async (token, client, user) => {
  const OAuthAccessTokenRepository = getRepository(OAuthAccessToken);
  const OAuthRefreshTokenRepository = getRepository(OAuthRefreshToken);
  const createAccessTokenResult = await OAuthAccessTokenRepository.save({
    access_token: token.accessToken,
    expires: token.accessTokenExpiresAt,
    scope: token.scope,
    client: client.id,
    user: user.id,
  });

  const createRefreshTokenResult = await OAuthRefreshTokenRepository.save({
    refresh_token: token.refreshToken,
    access_token: createAccessTokenResult,
    expires: token.refreshTokenExpiresAt,
    scope: token.scope,
    client: client.id,
    user: user.id,
  });

  return {
    accessToken: createAccessTokenResult.access_token,
    accessTokenExpiresAt: createAccessTokenResult.expires,
    refreshToken: createRefreshTokenResult.refresh_token,
    refreshTokenExpiresAt: createRefreshTokenResult.expires,
    scope: createAccessTokenResult.scope,
    client: { id: createAccessTokenResult.client },
    user: { id: createAccessTokenResult.user },
  };
};

const getClient = async (clientId, clientSecret) => {
  const OAuthClientRepository = getRepository(OAuthClient);
  const options = {
    where: { client_id: clientId },
  };

  if (clientSecret) {
    (options as any).where.client_secret = clientSecret;
  }

  const client = await OAuthClientRepository.findOne(options);

  if (!client) return false;

  return {
    id: client.id,
    redirectUris: client.redirect_uri,
    grants: client.grant_types,
  };
};

const getRefreshToken = async (refreshToken) => {
  const OAuthRefreshTokenRepository = getRepository(OAuthRefreshToken);
  const refreshTokenResult = await OAuthRefreshTokenRepository.findOne({
    where: { refresh_token: refreshToken },
    relations: ['user', 'client'],
  });

  if (!refreshTokenResult) {
    return false;
  }

  return {
    refreshToken: refreshTokenResult.refresh_token,
    refreshTokenExpiresAt: refreshTokenResult.expires,
    scope: refreshTokenResult.scope,
    client: refreshTokenResult.client,
    user: refreshTokenResult.user,
  };
};

const revokeToken = async (token) => {
  const OAuthRefreshTokenRepository = getRepository(OAuthRefreshToken);
  const refreshTokenDestroy = await OAuthRefreshTokenRepository.delete({
    refresh_token: token.refreshToken,
  });

  return refreshTokenDestroy;
};

const verifyScope = (token, scope) => {
  return token.scope === scope;
};

export default {
  getAccessToken,
  getRefreshToken,
  getUser,
  revokeToken,
  verifyScope,
  saveToken,
  getClient,
};
