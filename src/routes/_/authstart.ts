import { APIEvent } from 'solid-start';
import crypto from 'crypto';
import { getSessionStorage, SessionKey } from '../../auth/session';
import { getLoginProvider } from '../../auth/provider';

export async function GET({ request }: APIEvent) {
  const url = new URL(request.url);
  const state = crypto.randomBytes(512 / 8).toString('base64'); // 512 bits
  const storage = getSessionStorage();
  const session = await storage.getSession(request.headers.get('Cookie'));
  session.set(SessionKey.State, state);

  const provider = url.searchParams.get('provider');
  const loginProvider = getLoginProvider(provider);
  if (!loginProvider) {
    throw new Error(`Invalid login provider id: ${provider}`);
  }

  if (loginProvider) {
    const loginUrl = loginProvider.getAuthUri(state);
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
}
