import { Button, Group, Spacer } from 'dolmen/dist/mjs';
import { createSignal, lazy } from 'solid-js';
import { useRouteData } from 'solid-start';
import { createServerData$ } from 'solid-start/server';
import { fetchChannels } from '../../db/client';

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
          New Channel
        </Button>
      </Group>
      <ul>
        <li>Fake</li>
        {channels()?.map(channel => (
          <li>{channel.name}</li>
        ))}
      </ul>
      <CreateChannelDialog open={openCreate()} onClose={() => setOpenCreate(false)} />
    </div>
  );
}
