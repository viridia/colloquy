import { Page } from 'dolmen';
import { useParams } from 'solid-start';
import { AppHeader } from '../components/AppHeader';

export function routeData() {
  //
}

// function validateUsername(username: unknown) {
//   if (typeof username !== 'string' || username.length < 3) {
//     return `Usernames must be at least 3 characters long`;
//   }
// }

// function validatePassword(password: unknown) {
//   if (typeof password !== 'string' || password.length < 6) {
//     return `Passwords must be at least 6 characters long`;
//   }
// }

export default function Login() {
  const params = useParams();

  // const [loggingIn, { Form }] = createServerAction$(async (form: FormData) => {
  //   const loginType = form.get('loginType');
  //   const username = form.get('username');
  //   const password = form.get('password');
  //   const redirectTo = form.get('redirectTo') || '/';
  //   if (
  //     typeof loginType !== 'string' ||
  //     typeof username !== 'string' ||
  //     typeof password !== 'string' ||
  //     typeof redirectTo !== 'string'
  //   ) {
  //     throw new FormError(`Form not submitted correctly.`);
  //   }

  //   const fields = { loginType, username, password };
  //   const fieldErrors = {
  //     username: validateUsername(username),
  //     password: validatePassword(password),
  //   };
  //   if (Object.values(fieldErrors).some(Boolean)) {
  //     throw new FormError('Fields invalid', { fieldErrors, fields });
  //   }

  //   switch (loginType) {
  //     case 'login': {
  //       const user = await login({ username, password });
  //       if (!user) {
  //         throw new FormError(`Username/Password combination is incorrect`, {
  //           fields,
  //         });
  //       }
  //       return createUserSession(`${user.id}`, redirectTo);
  //     }
  //     default: {
  //       throw new FormError(`Login type invalid`, { fields });
  //     }
  //   }
  // });

  return (
    <Page>
      <AppHeader />
        <input type="hidden" name="redirectTo" value={params.redirectTo ?? '/'} />
        <div>
          <label for="username-input">Username</label>
          <input name="username" placeholder="kody" />
        </div>
        <div>
          <label for="password-input">Password</label>
          <input name="password" type="password" placeholder="twixrox" />
        </div>
    </Page>
  );
}
