import { APIEvent } from 'solid-start';
import crypto from 'crypto';
import { getSessionStorage, SessionKey } from '../../auth/session';

export async function GET({ request }: APIEvent) {
  const url = new URL(request.url);
  const state = crypto.randomBytes(512 / 8).toString('base64');
  const storage = getSessionStorage();
  const session = await storage.getSession(request.headers.get('Cookie'));
  session.set(SessionKey.State, state);

  switch (url.searchParams.get('provider')) {
    case 'github': {
      const loginUrl = new URL('https://github.com/login/oauth/authorize');
      loginUrl.search = new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID,
        redirect_uri: `${process.env.AUTH_REDIRECT_URL}/auth/github`,
        scope: 'read:user user:email',
        state: state,
      }).toString();
      try {
        return new Response(
          JSON.stringify({
            url: loginUrl.toString(),
          }),
          {
            headers: { 'Set-Cookie': await storage.commitSession(session) },
          }
        );
      } catch (e) {
        console.error(e);
        throw e;
      }
    }

    case 'google': {
      const loginUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      loginUrl.search = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: `${process.env.AUTH_REDIRECT_URL}/auth/google`,
        response_type: 'code',
        scope: 'openid email profile',
        state: state,
        nonce: crypto.randomUUID(),
      }).toString();
      return new Response(
        JSON.stringify({
          url: loginUrl.toString(),
          state,
        }),
        {
          headers: { 'Set-Cookie': await storage.commitSession(session) },
        }
      );
    }

    case 'discord': {
      const loginUrl = new URL('https://discord.com/api/oauth2/authorize');
      loginUrl.search = new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        redirect_uri: `${process.env.AUTH_REDIRECT_URL}/auth/discord`,
        response_type: 'code',
        scope: 'identify email',
        state: state,
        nonce: crypto.randomUUID(),
      }).toString();
      return new Response(
        JSON.stringify({
          url: loginUrl.toString(),
          state,
        }),
        {
          headers: { 'Set-Cookie': await storage.commitSession(session) },
        }
      );
    }

    default: {
      return new Response('{}', { status: 400 });
    }
  }
}
