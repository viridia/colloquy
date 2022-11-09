import { Alert, Button, CssTransitionState, FormField, Input, Modal, Title, Text } from 'dolmen';
import { createEffect, createSignal, Show, useContext, VoidComponent } from 'solid-js';
import { createServerAction$ } from 'solid-start/server';
import { getSessionStorage, SessionKey } from '../auth/session';
import { useClientSession } from '../auth/sessionContext';
import { userInputSchema, usernameSchema } from '../auth/validation';
import { db } from '../db/client';
import { gql, GraphQLContext } from '../graphql/client';
import { QueryAccountArgs, UserAccount } from '../graphql/types';

interface Props {
  state: CssTransitionState;
  onClose: () => void;
  onCancel: () => void;
}

export const queryAccount = gql`
  query QueryAccount($username: String!) {
    account(username: $username) {
      username
    }
  }
`;

const CreateProfileDialog: VoidComponent<Props> = props => {
  const gqlClient = useContext(GraphQLContext);
  const session = useClientSession();
  const [username, setUsername] = createSignal(session.name.toLowerCase());
  const [usernameSeverity, setUsernameSeverity] = createSignal<'error' | 'success' | undefined>();
  const [usernameMessage, setUsernameMessage] = createSignal<string>('');

  // Not using form validator here because validation is async.
  let checkInProgress = false;
  createEffect(() => {
    const name = username();
    checkInProgress = false;

    const valid = usernameSchema.safeParse(name);
    if (valid.success === false) {
      const issue = valid.error.issues[0];
      setUsernameSeverity('error');
      if (issue.message === 'required') {
        setUsernameMessage('Username is required.');
      } else if (issue.code === 'too_small') {
        if (name.length === 0) {
          setUsernameMessage('Username is required.');
        } else {
          setUsernameMessage('Username must be at least 3 characters.');
        }
      } else if (issue.message === 'letter') {
        setUsernameMessage('Username must begin with a letter.');
      } else if (issue.message === 'no-spaces') {
        setUsernameMessage('Username cannot contain spaces.');
      } else if (issue.message === 'illegal-character') {
        setUsernameMessage('Username cannot contain "@", "#" or "`".');
      } else {
        console.log(issue);
        setUsernameMessage(issue.message);
      }
      return;
    }

    checkInProgress = true;
    gqlClient
      .request<{ account: UserAccount }, QueryAccountArgs>(queryAccount, {
        username: name,
      })
      .then(
        account => {
          if (checkInProgress) {
            if (account.account) {
              setUsernameSeverity('error');
              setUsernameMessage('Username is already taken');
            } else {
              setUsernameSeverity('success');
              setUsernameMessage('Username is available');
            }
          }
        },
        error => {
          console.error(error);
          setUsernameSeverity('error');
          setUsernameMessage('Username check failed');
        }
      );
  });

  const [createAccount, { Form }] = createServerAction$(async (formData: FormData, { request }) => {
    const storage = getSessionStorage();
    const session = await storage.getSession(request.headers.get('Cookie'));

    const email = session.get(SessionKey.Email);
    const avatar = session.get(SessionKey.Avatar);
    const username = formData.get('username') as string;
    const displayName = formData.get('name') as string;

    const data = {
      username,
      displayName,
      email,
      avatar,
    };

    const valid = userInputSchema.safeParse(data);
    if (valid.success === false) {
      const issue = valid.error.issues[0];
      return new Response(JSON.stringify({ error: issue.message }), { status: 400 });
    }

    await db.user.create({ data });
  });

  return (
    <Modal.Dialog
      state={props.state}
      onClose={props.onCancel}
      withClose
      size="xs"
      aria-label="Welcome"
    >
      <Form>
        <Modal.Header>Welcome</Modal.Header>
        <Modal.Body gap="xl">
          <Title>Let's create your account</Title>
          <FormField
            title="Username"
            description="Unique, no spaces, short"
            severity={usernameSeverity()}
            message={usernameMessage()}
          >
            <Input
              name="username"
              max={32}
              autofocus
              value={username()}
              onInput={e => setUsername(e.currentTarget.value)}
            />
          </FormField>
          <FormField title="Name" description="Your full name (optional)">
            <Input name="name" value={session.name} max={32} />
          </FormField>
          <FormField
            title="Email"
            description="Never shown to the public"
            success={<span>Your email has been authenticated by {session.authProvider}</span>}
          >
            <Input name="email" readOnly value={session.email} />
          </FormField>
          <Show when={createAccount.error}>
            <Alert severity="error">{createAccount.error}</Alert>
          </Show>
        </Modal.Body>
        <Modal.Footer flexDirection="column" alignItems="end" gap="xl">
          <Button
            color="primary"
            disabled={createAccount.pending || usernameSeverity() !== 'success'}
            type="submit"
          >
            Create Your Account
          </Button>
          <Text size="xs">
            By registering, you agree to the [privacy policy] and [terms of service] (TODO).
          </Text>
        </Modal.Footer>
      </Form>
    </Modal.Dialog>
  );
};

export default CreateProfileDialog;
