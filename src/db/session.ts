import { redirect } from 'solid-start/server';
import { createCookieSessionStorage } from 'solid-start/session';
import { db } from './index';

type LoginForm = {
  username: string;
  password: string;
};

export async function login({ username, password }: LoginForm) {
  const user = await db.user.findUnique({ where: { username } });
  if (!user) return null;
  const isCorrectPassword = password === user.password;
  if (!isCorrectPassword) return null;
  return user;
}

const storage = createCookieSessionStorage({
  cookie: {
    name: 'RJ_session',
    // secure doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: true,
    secrets: ['hello'],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

// export async function requireUserId(
//   request: Request,
//   redirectTo: string = new URL(request.url).pathname
// ) {
//   const session = await getUserSession(request);
//   const userId = session.get("userId");
//   if (!userId || typeof userId !== "string") {
//     const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
//     throw redirect(`/login?${searchParams}`);
//   }
//   return userId;
// }

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set('userId', userId);
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  });
}
