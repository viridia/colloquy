import {
  Alert,
  Button,
  createFormValidation,
  CssTransitionState,
  FormField,
  Input,
  Modal,
  Title,
  Text,
} from 'dolmen';
import { createSignal, Show, VoidComponent } from 'solid-js';
import { createRouteAction } from 'solid-start';
import { useSession } from '../auth/session';
import { decodeErrors } from '../graphql/client';

interface Props {
  state: CssTransitionState;
  onClose: () => void;
  onCancel: () => void;
}

const CreateProfileDialog: VoidComponent<Props> = props => {
  const [error, setError] = createSignal('');
  const session = useSession();

  const { errors, formProps } = createFormValidation<{
    username: string;
    name: string;
  }>({
    username: {
      required: (data: string) => data.length > 0,
      short: (data: string) => data.length > 2,
      spaces: (data: string) => data.search(/\s/) >= 0,
      illegal: (data: string) => Boolean(data.match(/^[a-zA-Z0-9_-]$/)),
    },
  });

  const [creating, { Form }] = createRouteAction(async (formData: FormData) => {
    setError('');
    try {
      // await gqlClient.request<Channel, MutationCreateChannelArgs>(
      //   createChannelMutation,
      //   {
      //     channel: {
      //       name: formData.get('channelName') as string,
      //       description: formData.get('description') as string,
      //       public: Boolean(formData.get('public')),
      //       color: formData.get('color') as string,
      //     },
      //   }
      // );

      // console.log(resp);

      props.onClose();
    } catch (clientError) {
      setError(decodeErrors(clientError.response));
    }
  });

  return (
    <Form {...formProps}>
      <Modal.Dialog
        state={props.state}
        onClose={props.onCancel}
        withClose
        size="xs"
        aria-label="Welcome"
      >
        <Modal.Header>Welcome</Modal.Header>
        <Modal.Body gap="xl">
          <Title>Let's create your account</Title>
          <FormField
            title="Username"
            description="Unique, no spaces, short"
            severity={errors.username ? 'error' : 'success'}
            message={
              {
                required: 'Username is required.',
                short: 'Username must be at least 3 characters.',
                spaces: 'Spaces are not allowed.',
                illegal: 'Illegal character.',
                notAvail: 'That name is not available.',
              }[errors.username] ||
              errors.username ||
              'Username is available'
            }
          >
            <Input name="username" max={32} autofocus />
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
          <Show when={error()}>
            <Alert severity="error">{error()}</Alert>
          </Show>
        </Modal.Body>
        <Modal.Footer flexDirection="column" alignItems="end" gap="xl">
          <Button color="primary" disabled={creating.pending} type="submit">
            Create Your Account
          </Button>
          <Text size="xs">
            By registering, you agree to the [privacy policy] and [terms of service] (TODO).
          </Text>
        </Modal.Footer>
      </Modal.Dialog>
    </Form>
  );
};

export default CreateProfileDialog;
