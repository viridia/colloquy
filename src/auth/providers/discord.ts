import { ILoginProvider, IProfileData } from '../provider';

interface IDiscordConfig {
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
  scopes?: string[];
}

export default (config: IDiscordConfig): ILoginProvider => {
  return {
    id: 'discord',
    getAuthUri(state) {
      const loginUrl = new URL('https://discord.com/api/oauth2/authorize');
      loginUrl.search = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.callbackUrl,
        response_type: 'code',
        scope: ['identify', 'email', ...(config.scopes ?? [])].join(' '),
        state,
      }).toString();
      return loginUrl;
    },

    async fetchProfile(code: string): Promise<IProfileData> {
      const authUrl = new URL('https://discord.com/api/oauth2/token');
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

      const json = await resp.json();
      if (json.error) {
        throw new Error(json.error);
      } else if (!json.access_token) {
        throw new Error('Missing access token');
      }

      const userInfoUrl = new URL('https://discord.com/api/users/@me');
      const resp2 = await fetch(userInfoUrl, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${json.access_token}`,
        },
      });

      if (resp2.status !== 200) {
        console.error(await resp2.json());
        throw new Error(`Profile request returned status: ${resp2.status}`);
      }

      const profile = await resp2.json();
      if (!profile.email) {
        throw new Error('No email in login provider response');
      }

      return {
        name: profile.name ?? '',
        email: profile.email,
        avatar: profile.avatar_url,
        profile,
      };
    },
  };
};
