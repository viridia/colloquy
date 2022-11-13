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
  css,
  cx,
} from 'dolmen';
import { createEffect, createSignal, Show, useContext, VoidComponent } from 'solid-js';
import { createRouteAction } from 'solid-start';
import { GraphQLContext, decodeErrors, gql } from '../graphql/client';
import { Channel, MutationCreateChannelArgs, MutationModifyChannelArgs } from '../graphql/types';
import { channelColors } from './channelColors';

const formClass = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  overflow: 'hidden',
});

interface Props {
  channelToEdit: Channel | null;
  open: boolean;
  onClose: () => void;
}

export const createChannelMutation = gql`
  mutation CreateChannel($channel: ChannelInput!) {
    createChannel(channel: $channel) {
      id
      name
    }
  }
`;

export const modifyChannelMutation = gql`
  mutation ModifyChannel($channelId: String!, $channel: ChannelInput!) {
    modifyChannel(channelId: $channelId, channel: $channel) {
      id
      name
    }
  }
`;

const CreateChannelDialog: VoidComponent<Props> = props => {
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
      if (props.channelToEdit) {
        await gqlClient.request<Channel, MutationModifyChannelArgs>(modifyChannelMutation, {
          channelId: props.channelToEdit.id,
          channel: {
            name: formData.get('channelName') as string,
            description: formData.get('description') as string,
            public: Boolean(formData.get('public')),
            color: formData.get('color') as string,
          },
        });
      } else {
        await gqlClient.request<Channel, MutationCreateChannelArgs>(createChannelMutation, {
          channel: {
            name: formData.get('channelName') as string,
            description: formData.get('description') as string,
            public: Boolean(formData.get('public')),
            color: formData.get('color') as string,
          },
        });
      }

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
    <Modal
      open={props.open}
      onClose={props.onClose}
      withClose
      size="sm"
      aria-label="Create channel"
    >
      <Form {...formProps} class={formClass()}>
        <Modal.Header>
          <Show when={props.channelToEdit} fallback={<span>New Channel</span>}>
            Update Channel
          </Show>
        </Modal.Header>
        <Modal.Body gap="xl">
          <FormField
            title="Channel Name"
            error={
              {
                required: 'Channel name is required.',
              }[errors.channelName]
            }
          >
            <Input name="channelName" max={24} autofocus value={props.channelToEdit?.name ?? ''} />
          </FormField>
          <FormField title="Channel Description">
            <TextArea
              classList={cx({ h: '5rem' })}
              name="description"
              value={props.channelToEdit?.description ?? ''}
            />
          </FormField>
          <FormField>
            <CheckBox checked={props.channelToEdit?.public ?? true} name="public">
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
              value={props.channelToEdit?.color ?? '#CFD8DC'}
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
            <Show when={props.channelToEdit} fallback={<span>Create</span>}>
              Save
            </Show>
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateChannelDialog;
