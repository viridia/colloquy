import {
  Alert,
  Button,
  CheckBox,
  ColorSwatch,
  FormField,
  Group,
  Input,
  Modal,
  Stack,
  TextArea,
} from 'dolmen';
import { createSignal, For, Show, VoidComponent } from 'solid-js';
import { createRouteAction } from 'solid-start';
import { channelColors } from './channelColors';

interface Props {
  open: boolean;
  onClose: () => void;
}

const CreateChannelDialog: VoidComponent<Props> = props => {
  const [channelColor, setChannelColor] = createSignal('#CFD8DC');
  const [channelIsPublic, setChannelIsPublic] = createSignal(true);
  const [error, setError] = createSignal('');

  const [creating, { Form }] = createRouteAction(async (formData: FormData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(Array.from(formData.keys()));
    console.log(formData.get('channelName'));
    setError('Invalid channel name');
    const username = formData.get('username');
    if (username === 'admin') {
      // return redirect('/admin');
    } else {
      throw new Error('Invalid username');
    }
    // return redirect('/home');
    props.onClose();
  });

  return (
    <Form>
      <Modal open={props.open} onClose={props.onClose} withClose size="sm">
        <Modal.Header>New Channel</Modal.Header>
        <Modal.Body gap="xl">
          <FormField title="Channel Name">
            <Input name="channelName" />
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
          <Group gap="md">
            <For each={channelColors}>
              {shades => (
                <Stack gap="md" flex="1 1 0">
                  <For each={shades}>
                    {color => (
                      <ColorSwatch
                        color={color}
                        alignSelf="stretch"
                        selected={color === channelColor()}
                        onClick={() => {
                          setChannelColor(color);
                        }}
                      />
                    )}
                  </For>
                </Stack>
              )}
            </For>
            <input type="hidden" name="color" value={channelColor()} />
          </Group>
          <Show when={error()}>
            <Alert severity="error">{error()}</Alert>
          </Show>
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={creating.pending} onClick={() => props.onClose()}>
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
