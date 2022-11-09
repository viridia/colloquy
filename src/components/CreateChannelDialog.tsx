import {
  Alert,
  Button,
  CheckBox,
  FormField,
  Input,
  Modal,
  TextArea,
  createFormValidation,
  ColorGrid,
} from 'dolmen';
import { createEffect, createSignal, Show, useContext, VoidComponent } from 'solid-js';
import { createRouteAction } from 'solid-start';
import { GraphQLContext, decodeErrors, gql } from '../graphql/client';
import { Channel, MutationCreateChannelArgs } from '../graphql/types';
import { channelColors } from './channelColors';

interface Props {
  open: boolean;
  onClose: () => void;
}

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
      await gqlClient.request<Channel, MutationCreateChannelArgs>(
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
      <Modal
        open={props.open}
        onClose={props.onClose}
        withClose
        size="sm"
        aria-label="Create channel"
      >
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
          <FormField title="Channel Badge Color">
            <ColorGrid
              name="color"
              colors={channelColors}
              columnMajor
              rows={4}
              gap="sm"
              value="#CFD8DC"
            />
          </FormField>
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
