import { ILoginProvider, IProfileData } from '../provider';

interface IGoogleConfig {
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
  scopes?: string[];
}

export default (config: IGoogleConfig): ILoginProvider => {
  return {
    id: 'google',
    getAuthUri(state, nonce) {
      const loginUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      loginUrl.search = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.callbackUrl,
        response_type: 'code',
        scope: ['openid', 'email', 'profile', ...(config.scopes ?? [])].join(' '),
        state,
        nonce,
      }).toString();
      return loginUrl;
    },

    async fetchProfile(code, nonce): Promise<IProfileData> {
      const authUrl = new URL('https://oauth2.googleapis.com/token');
      const params = new URLSearchParams();
      params.set('client_id', config.clientId);
      params.set('client_secret', config.clientSecret);
      params.set('code', code);
      params.set('redirect_uri', config.callbackUrl);
      params.set('grant_type', 'authorization_code');
      const resp = await fetch(authUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      if (resp.status >= 400) {
        throw new Error(`Token request returned status: ${resp.status}`);
      }

      const json = await resp.json();
      if (json.error) {
        throw new Error(json.error);
      }

      if (!json.id_token) {
        throw new Error('No id_token in login provider response');
      }

      const userData = parseJwt(json.id_token);
      if (typeof userData.email !== 'string') {
        throw new Error('No email in login provider response');
      }

      if (userData.nonce !== nonce) {
        throw new Error('Nonce does not match, possible replay attack.');
      }

      return {
        email: userData.email,
        name: userData.name ?? '',
        avatar: userData.picture,
        profile: userData,
      };
    },
  };
};

function parseJwt(token: string) {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}
