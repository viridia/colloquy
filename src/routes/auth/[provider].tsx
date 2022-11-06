import { Alert, Stack, Title } from 'dolmen';
import { Show } from 'solid-js';
import { RouteDataArgs, useRouteData } from 'solid-start';
import { createServerData$, redirect } from 'solid-start/server';
import { URLSearchParams } from 'url';
import { getSessionStorage, SessionKey } from '../../auth/session';

export function routeData({ params }: RouteDataArgs) {
  return createServerData$(
    async ([, provider], { request }) => {
      const url = new URL(request.url);
      if (url.searchParams.get('error')) {
        return {
          error: url.searchParams.get('error'),
          description: url.searchParams.get('error_description'),
          errorUri: url.searchParams.get('error_uri'),
        };
      }

      const storage = getSessionStorage();
      const session = await storage.getSession(request.headers.get('Cookie'));
      const sessionState = session.get('state');
      session.unset(SessionKey.State);
      session.set(SessionKey.AuthProvider, provider);

      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      if (!code) {
        return {
          error: 'No code returned from sign-on provider',
        };
      }

      if (state !== sessionState) {
        return {
          error: 'OAuth state does not match',
        };
      }

      if (provider === 'github') {
        const authUrl = new URL('https://github.com/login/oauth/access_token');
        const params = new URLSearchParams();
        params.set('client_id', process.env.GITHUB_CLIENT_ID);
        params.set('client_secret', process.env.GITHUB_CLIENT_SECRET);
        params.set('code', code);
        params.set('redirect_uri', `${process.env.AUTH_REDIRECT_URL}/auth/github`);
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
          return {
            error: json.error,
            description: json.error_description,
            errorUri: json.error_uri,
          };
        } else if (!json.access_token) {
          return {
            error: 'Missing access token',
          };
        }

        const userInfoUrl = new URL('https://api.github.com/user');
        const resp2 = await fetch(userInfoUrl, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${json.access_token}`,
          },
        });

        if (resp2.status === 200) {
          const profile = await resp2.json();
          if (!profile.email) {
            return {
              error: 'No email from signon provider',
            };
          }

          session.set(SessionKey.Name, profile.name);
          session.set(SessionKey.Email, profile.email);
          session.set(SessionKey.Avatar, profile.avatar_url);

          // TODO: look up user in database and fill in userId.

          throw redirect('/', {
            headers: {
              'Set-Cookie': await storage.commitSession(session),
            },
          });
        } else {
          console.log(await resp2.json());
          return {
            error: `HTTP Status ${resp2.status}`,
          };
        }
      } else if (provider === 'google') {
        const authUrl = new URL('https://oauth2.googleapis.com/token');
        const params = new URLSearchParams();
        params.set('client_id', process.env.GOOGLE_CLIENT_ID);
        params.set('client_secret', process.env.GOOGLE_CLIENT_SECRET);
        params.set('code', code);
        params.set('redirect_uri', `${process.env.AUTH_REDIRECT_URL}/auth/google`);
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
          return {
            error: `HTTP status ${resp.status}`,
          };
        }

        const json = await resp.json();
        if (json.error) {
          return {
            error: json.error,
            description: json.error_description,
            errorUri: json.error_uri,
          };
        }

        if (json.id_token) {
          const userData = parseJwt(json.id_token);
          console.log(userData.name);
          if (typeof userData.email === 'string') {
            session.set(SessionKey.Name, userData.name ?? '');
            session.set(SessionKey.Email, userData.email);
            session.set(SessionKey.Avatar, userData.picture);

            throw redirect('/', {
              headers: {
                'Set-Cookie': await storage.commitSession(session),
              },
            });
          }
        }

        return {
          error: 'Missing user email',
        }
      } else if (provider === 'discord') {
        const authUrl = new URL('https://discord.com/api/oauth2/token');
        const params = new URLSearchParams();
        params.set('client_id', process.env.DISCORD_CLIENT_ID);
        params.set('client_secret', process.env.DISCORD_CLIENT_SECRET);
        params.set('code', code);
        params.set('redirect_uri', `${process.env.AUTH_REDIRECT_URL}/auth/discord`);
        params.set('grant_type', 'authorization_code');
        const resp = await fetch(authUrl, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params.toString(),
        });
        // console.log(resp);
        const json = await resp.json();
        if (json.error) {
          return {
            error: json.error,
            description: json.error_description,
            errorUri: json.error_uri,
          };
        } else if (!json.access_token) {
          return {
            error: 'Missing access token',
          };
        }

        const userInfoUrl = new URL('https://discord.com/api/users/@me');
        const resp2 = await fetch(userInfoUrl, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${json.access_token}`,
          },
        });

        if (resp2.status === 200) {
          const profile = await resp2.json();
          console.log(profile);
          if (!profile.email) {
            return {
              error: 'No email from signon provider',
            };
          }

          session.set(SessionKey.Name, profile.name);
          session.set(SessionKey.Email, profile.email);
          session.set(SessionKey.Avatar, profile.avatar_url);

          // TODO: look up user in database and fill in userId.

          throw redirect('/', {
            headers: {
              'Set-Cookie': await storage.commitSession(session),
            },
          });
        } else {
          console.log(await resp2.json());
          return {
            error: `HTTP Status ${resp2.status}`,
          };
        }
      }

      // Authorization: Bearer OAUTH-TOKEN
      // GET https://api.github.com/user

      // if (await getUser(request)) {
      //   throw redirect('/');
      // }
      return {};
    },
    { key: () => ['provider', params.provider] }
  );
}

/** Landing page for OAuth redirect. */
export default function AuthRedirectLanding() {
  const data = useRouteData<typeof routeData>();
  return (
    <Stack m="xl" gap="xl">
      <Title>Logging In</Title>
      <Show when={data()?.error}>
        <Alert color="error">{data().description || data().error}</Alert>
      </Show>
    </Stack>
  );
}

function parseJwt(token: string) {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}
