import {
  Alert,
  Button,
  CheckBox,
  FormField,
  Group,
  Input,
  Modal,
  TextArea,
  createFormValidation,
} from 'dolmen';
import { createEffect, createSignal, Show, useContext, VoidComponent } from 'solid-js';
import { createRouteAction } from 'solid-start';
import { GraphQLContext, decodeErrors } from '../graphql/client';
import { Channel, MutationCreateChannelArgs } from '../graphql/types';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const gql = (query: TemplateStringsArray) =>
  query
    .join(' ')
    .replace(/#.+\r?\n|\r/g, '')
    .replace(/\r?\n|\r/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

export const createChannelMutation = gql`
  mutation CreateChannel($channel: ChannelInput!) {
    createChannel(channel: $channel) {
      id
      name
      description
    }
  }
`;

const CreateChannelDialog: VoidComponent<Props> = props => {
  const [channelColor, setChannelColor] = createSignal('#CFD8DC');
  const [channelIsPublic, setChannelIsPublic] = createSignal(true);
  const [error, setError] = createSignal('');
  const { errors, formProps } = createFormValidation<{
    channelName: string;
    description: string;
  }>({
    channelName: {
      required: (data: string) => data.length > 0,
    },
  });
  const gqlClient = useContext(GraphQLContext);

  const [creating, { Form }] = createRouteAction(async (formData: FormData) => {
    setError('');
    try {
      const resp = await gqlClient.request<Channel, MutationCreateChannelArgs>(
        createChannelMutation,
        {
          channel: {
            name: formData.get('channelName') as string,
            description: formData.get('description') as string,
            public: Boolean(formData.get('public')),
            color: formData.get('color') as string,
          },
        }
      );

      console.log(resp);

      props.onClose();
    } catch (clientError) {
      setError(decodeErrors(clientError.response));
    }
  });

  createEffect(() => {
    if (props.open) {
      creating.clear();
    }
  });

  return (
    <Form {...formProps}>
      <Modal open={props.open} onClose={props.onClose} withClose size="sm">
        <Modal.Header>New Channel</Modal.Header>
        <Modal.Body gap="xl">
          <FormField
            title="Channel Name"
            error={
              {
                required: 'Channel name is required.',
              }[errors.channelName]
            }
          >
            <Input name="channelName" max={24} autofocus />
          </FormField>
          <FormField title="Channel Description">
            <TextArea h="5rem" name="description" />
          </FormField>
          <FormField>
            <CheckBox
              checked={channelIsPublic()}
              onClick={() => {
                setChannelIsPublic(value => !value);
              }}
              name="public"
            >
              Public channel
            </CheckBox>
          </FormField>
          <Group gap="lg">
            <label>
              <input
                type="color"
                name="color"
                value={channelColor()}
                onChange={e => {
                  setChannelColor(e.currentTarget.value);
                }}
              />
              Channel Color
            </label>
          </Group>
          <Show when={error()}>
            <Alert severity="error">{error()}</Alert>
          </Show>
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={creating.pending} onClick={() => props.onClose()} type="button">
            Cancel
          </Button>
          <Button color="primary" disabled={creating.pending} type="submit">
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </Form>
  );
};

export default CreateChannelDialog;
