import { isServer } from 'solid-js/web';
import { createCookieSessionStorage, SessionStorage } from 'solid-start';
import { db } from '../db/client';
import gravatar from 'gravatar';
import { Membership, User } from '@prisma/client';
import { Session } from 'solid-start/session/sessions';

export enum PermissionLevel {
  VISITOR = 0,
  WRITER = 1,
  MODERATOR = 2,
  STAFF = 3,
  ADMIN = 4,
}

/** Session object. This is stored in a cookie. It can be in one of several states:
    * Pre-auth: If the user has not signed in, the session will be undefined.
    * During auth: During the OAuth flow, only the 'state' property will be set.
    * Post-auth: Immediately after the OAuth/OpenID flow:
      * If this is a returning user, then `username`, `email`, `name` and `avatar`
        will be filled in from the users table.
      * If this is the first visit, then `email`, `name` and `avatar` will be filled
        in from the OAuth response. `username` will be undefined. The user will subsrquently
        be prompted at this point to create a username, which will fill in the username
        and also add an entry into the users table.
    * Once the user has created their profile, all fields except `state` will be present.
*/

/** Map keys for session store properties. */
export enum SessionKey {
  /** Random string used to prevent replay attacks in OAuth/OpenID flow. */
  State = 'state',

  /** Random string used to prevent replay attacks in OAuth/OpenID flow. */
  Nonce = 'nonce',

  /** The displayable unique id of the user. */
  Username = 'username',

  /** The friendly display name of the user. */
  Name = 'name',

  /** The email address of the user. */
  Email = 'email',

  /** The image url of the user's avatar. */
  Avatar = 'avatar',

  /** Which auth provider authenticated the email address. */
  AuthProvider = 'provider',
}

let storage: SessionStorage;

export function getSessionStorage() {
  if (isServer && !storage) {
    if (!process.env.SESSION_SECRET) {
      throw new Error('Missing SESSION_SECRET');
    }
    storage = createCookieSessionStorage({
      cookie: {
        name: 'CQ_session',
        // secure doesn't work on localhost for Safari
        // https://web.dev/when-to-use-local-https/
        secure: true,
        secrets: [process.env.SESSION_SECRET],
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true,
      },
    });
  }
  return storage;
}

/** Session properties that are exposed to client - does not include userId, which
    is what authorization decisions are based on. */
export interface IClientSession {
  /** User is fully signed in and has a profile. */
  readonly isSignedIn: boolean;
  /** User has been authenticated but has not set up a profile. */
  readonly needsProfile: boolean;
  /** Unique username */
  readonly username?: string;
  /** Display name */
  readonly name: string;
  /** Email address. */
  readonly email: string;
  /** Avatar icon */
  readonly avatar: string | undefined;
  /** Name of the provider that authenticated the email */
  readonly authProvider: string | undefined;
  /** Permission level for current board. */
  readonly permission: PermissionLevel;
  /** Id of the discussion board. */
  readonly boardId: string;
  /** Title of the discussion board. */
  readonly boardName: string;
}

async function getSessionContextData(
  request: Request
): Promise<
  [Session, string | undefined, (User & { memberships: Membership[] }) | undefined, string]
> {
  const boardId = 'local';
  const session = await getSessionStorage().getSession(request.headers.get('Cookie'));
  const email = session.get(SessionKey.Email);
  const user = email
    ? await db.user.findUnique({
        where: {
          email: session.get(SessionKey.Email),
        },
        include: {
          memberships: {
            where: { boardId },
          },
        },
      })
    : null;

  return [session, email, user, boardId];
}

/** Returns a session object which is visible on the client. Only includes non-secret data. */
export async function getClientSession(request: Request): Promise<IClientSession> {
  const [session, email, user, boardId] = await getSessionContextData(request);
  const board = await db.board.findUnique({
    where: {
      id: boardId,
    },
  });

  return {
    get isSignedIn() {
      return Boolean(user);
    },

    get needsProfile() {
      return Boolean(user && !user.username);
    },

    get username() {
      return user?.username;
    },

    get name() {
      return user?.displayName;
    },

    get email() {
      return session.get(SessionKey.Email);
    },

    get avatar() {
      return email ? gravatar.url(email) : undefined;
    },

    get authProvider() {
      return session.get(SessionKey.AuthProvider);
    },

    get permission() {
      return PermissionLevel[user?.memberships?.[0]?.rank] ?? PermissionLevel.VISITOR;
    },

    get boardId() {
      return boardId;
    },

    get boardName() {
      return board?.name ?? 'Colloquy';
    },
  };
}

export interface IServerSession {
  /** User is fully signed in and has a profile. */
  readonly exists: boolean;
  /** Unique username */
  readonly username?: string;
  /** Primary database key for user */
  readonly userId?: string;
  /** Email address. */
  readonly email: string;
  /** Permission level for current board. */
  readonly permission: PermissionLevel;
  /** Id of the discussion board. */
  readonly boardId: string;
}

export async function getServerSession(request: Request): Promise<IServerSession> {
  const [, , user, boardId] = await getSessionContextData(request);
  return {
    get exists() {
      return Boolean(user);
    },

    get username() {
      return user?.username;
    },

    get userId() {
      return user?.id;
    },

    get email() {
      return user?.email;
    },

    get permission() {
      return PermissionLevel[user?.memberships?.[0]?.rank] ?? PermissionLevel.VISITOR;
    },

    get boardId() {
      return boardId;
    },
  };
}
