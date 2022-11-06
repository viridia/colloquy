import { createContext, useContext } from 'solid-js';
import { createCookieSessionStorage } from 'solid-start';

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

  /** Primary key of users table, basis for permission checks. Not visible on client. */
  UserId = 'userId',

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

const storage = createCookieSessionStorage({
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

export function getSessionStorage() {
  return storage;
}

/** Session properties that are exposed to client - does not include userId, which
    is what authorization decisions are based on. */
export interface ISession {
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
}

/** Returns a session object which is visible on the client. Only includes non-secret data. */
export async function getClientSession(request: Request): Promise<ISession> {
  const session = await storage.getSession(request.headers.get('Cookie'));
  return {
    get isSignedIn() {
      return Boolean(session.get(SessionKey.Username));
    },

    get needsProfile() {
      return Boolean(session.get(SessionKey.Email) && !session.get(SessionKey.Username));
    },

    get username() {
      return session.get(SessionKey.Username);
    },

    get name() {
      return session.get(SessionKey.Name);
    },

    get email() {
      return session.get(SessionKey.Email);
    },

    get avatar() {
      return session.get(SessionKey.Avatar);
    },

    get authProvider() {
      return session.get(SessionKey.AuthProvider);
    },
  };
}

export const SessionContext = createContext<ISession>();
export const useSession = () => useContext(SessionContext);
