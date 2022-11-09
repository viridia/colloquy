import { APIEvent } from 'solid-start';
import crypto from 'crypto';
import { getSessionStorage, SessionKey } from '../../auth/session';
import { getAuthUri } from '../../auth/provider';

export async function GET({ request }: APIEvent) {
  const url = new URL(request.url);
  const state = crypto.randomBytes(256 / 8).toString('base64'); // 256 bits
  const nonce = crypto.randomBytes(16).toString('base64');
  const storage = getSessionStorage();
  const session = await storage.getSession(request.headers.get('Cookie'));
  session.set(SessionKey.State, state);
  session.set(SessionKey.Nonce, nonce);

  const loginUrl = getAuthUri(url.searchParams.get('provider'), state, nonce);
  try {
    return new Response(JSON.stringify({ url: loginUrl.toString() }), {
      headers: { 'Set-Cookie': await storage.commitSession(session) },
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
}
