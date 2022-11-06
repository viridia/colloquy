import { redirect } from 'solid-start/server';
import { createCookieSessionStorage } from 'solid-start/session';
import { db } from './index';
import { db as prisma } from './client';

type LoginForm = {
  username: string;
  password: string;
};

export async function register({ username, password }: LoginForm) {
  return db.user.create({
    data: { username: username, password },
  });
}

export async function login({ username, password }: LoginForm) {
  const user = await db.user.findUnique({ where: { username } });
  if (!user) return null;
  const isCorrectPassword = password === user.password;
  if (!isCorrectPassword) return null;
  return user;
}

export async function createSession(name: string, email: string) {
  let user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  console.log(user);

  if (!user) {
    user = await prisma.user.create({
      data: {
        displayName: name,
        email,
        username: '',
      },
    });
  }

  // const user = await db.user.findUnique({ where: { username } });
  // if (!user) return null;
  // const isCorrectPassword = password === user.password;
  // if (!isCorrectPassword) return null;
  // return user;
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

export function getUserSession(request: Request) {
  return storage.getSession(request.headers.get('Cookie'));
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get('userId');
  if (!userId || typeof userId !== 'string') return null;
  return userId;
}

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

export async function getUser(request: Request): Promise<ISession | null> {
  const userId = await getUserId(request);
  if (typeof userId !== 'string') {
    return null;
  }

  try {
    const user = await db.user.findUnique({ where: { id: Number(userId) } });
    return { username: user.username, displayName: user.username, id: user.id + '' };
  } catch {
    // throw logout(request);
    return null;
  }
}

export async function logout(request: Request) {
  const session = await storage.getSession(request.headers.get('Cookie'));
  return redirect('/login', {
    headers: {
      'Set-Cookie': await storage.destroySession(session),
    },
  });
}

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set('userId', userId);
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  });
}

export interface ISession {
  username: string;
  displayName: string;
  id: string;
  // rank:
}

// export const SessionContext = createContext<ISession | null>();
// export const useSession = () => useContext(SessionContext);
