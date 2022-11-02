import { Button, EmptyResult, Group, Spacer } from 'dolmen/dist/mjs';
import { createSignal, lazy, Show } from 'solid-js';
import { useRouteData } from 'solid-start';
import { createServerData$ } from 'solid-start/server';
import { fetchChannels } from '../../db/client';
import { AddCircle } from '../../icons';

const CreateChannelDialog = lazy(() => import('../../components/CreateChannelDialog'));

export function routeData() {
  return createServerData$(async () => {
    const channels = await fetchChannels();
    return channels;
  });
}

export default function AdminChannels() {
  const channels = useRouteData<typeof routeData>();
  const [openCreate, setOpenCreate] = createSignal(false);

  return (
    <div>
      <Group>
        Channels
        <Spacer />
        <Button
          color="primary"
          onClick={() => {
            setOpenCreate(true);
          }}
        >
          <AddCircle />
          New Channel
        </Button>
      </Group>
      <Show
        when={channels()?.length > 0}
        fallback={<EmptyResult>No channels created yet.</EmptyResult>}
      >
        <ul>
          {channels()?.map(channel => (
            <li>{channel.name}</li>
          ))}
        </ul>
      </Show>
      <CreateChannelDialog open={openCreate()} onClose={() => setOpenCreate(false)} />
    </div>
  );
}
