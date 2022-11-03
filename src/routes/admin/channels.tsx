import { Button, EmptyResult, Group, Spacer, Table } from 'dolmen';
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
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Cell>Channel</Table.Cell>
              <Table.Cell>Description</Table.Cell>
              <Table.Cell>Public?</Table.Cell>
              <Table.Cell>Color</Table.Cell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {channels()?.map(channel => (
              <Table.Row>
                <Table.Cell>{channel.name}</Table.Cell>
                <Table.Cell>{channel.description}</Table.Cell>
                <Table.Cell>{channel.public}</Table.Cell>
                <Table.Cell>{channel.color}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Show>
      <CreateChannelDialog open={openCreate()} onClose={() => setOpenCreate(false)} />
    </div>
  );
}
