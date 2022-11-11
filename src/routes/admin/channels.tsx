import { Channel } from '@prisma/client';
import { Button, ColorSwatch, EmptyResult, Group, Page, Spacer, Table } from 'dolmen';
import { createSignal, lazy, Show } from 'solid-js';
import { useRouteData } from 'solid-start';
import { createServerData$ } from 'solid-start/server';
import { getServerSession } from '../../auth/session';
import { channelsQuery } from '../../graphql/queries';
import { runQuery } from '../../graphql/serverClient';
import { AddCircle, Settings } from '../../icons';

const CreateChannelDialog = lazy(() => import('../../components/CreateChannelDialog'));

export function routeData() {
  return createServerData$(async (_, { request }) => {
    const session = await getServerSession(request);
    return await runQuery<{ channels: Channel[] }>({
      operationName: 'Channels',
      query: channelsQuery,
      variables: {},
      session,
    });
  });
}

export default function AdminChannels() {
  const data = useRouteData<typeof routeData>();
  const [openCreate, setOpenCreate] = createSignal(false);
  const [channelToEdit, setChannelToEdit] = createSignal<Channel | null>(null);

  return (
    <Page.Content>
      <Group>
        Channels
        <Spacer />
        <Button
          color="primary"
          onClick={() => {
            setChannelToEdit(null);
            setOpenCreate(true);
          }}
        >
          <AddCircle width={16} />
          New Channel
        </Button>
      </Group>
      <Show
        when={data()?.channels.length > 0}
        fallback={<EmptyResult>No channels created yet.</EmptyResult>}
      >
        <Table mt="2rem">
          <Table.Head>
            <Table.Row>
              <Table.Cell>Channel</Table.Cell>
              <Table.Cell>Description</Table.Cell>
              <Table.Cell>Public?</Table.Cell>
              <Table.Cell>Color</Table.Cell>
              <Table.Cell></Table.Cell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {data()?.channels.map(channel => (
              <Table.Row>
                <Table.Cell>{channel.name}</Table.Cell>
                <Table.Cell>{channel.description}</Table.Cell>
                <Table.Cell textAlign="center">
                  <Show when={channel.public}>&#10003;</Show>
                </Table.Cell>
                <Table.Cell>
                  <ColorSwatch color={channel.color} />
                </Table.Cell>
                <Table.Cell>
                  <Button
                    color="subtle"
                    icon
                    onClick={() => {
                      setChannelToEdit(channel);
                      setOpenCreate(true);
                    }}
                  >
                    <Settings />
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Show>
      <CreateChannelDialog
        channelToEdit={channelToEdit()}
        open={openCreate()}
        onClose={() => setOpenCreate(false)}
      />
    </Page.Content>
  );
}
