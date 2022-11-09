import { Alert, Stack, Title } from 'dolmen';
import { Show } from 'solid-js';
import { RouteDataArgs, useRouteData } from 'solid-start';
import { createServerData$, redirect } from 'solid-start/server';
import { fetchProfile } from '../../auth/provider';
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
      const sessionState = session.get(SessionKey.State);
      const nonce = session.get(SessionKey.Nonce);
      session.unset(SessionKey.State);
      session.unset(SessionKey.Nonce);
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

      try {
        const userInfo = await fetchProfile(provider, code, nonce);
        session.set(SessionKey.Name, userInfo.name);
        session.set(SessionKey.Email, userInfo.email);
        session.set(SessionKey.Avatar, userInfo.avatar);
      } catch (e) {
        console.error(e);
        return {
          error: (e as Error).message,
        };
      }

      throw redirect('/', {
        headers: {
          'Set-Cookie': await storage.commitSession(session),
        },
      });
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
