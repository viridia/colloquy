import { Channel } from '@prisma/client';
import {
  Button,
  ColorSwatch,
  css,
  EmptyResult,
  Group,
  Menu,
  Page,
  Spacer,
  Stack,
  Table,
} from 'dolmen';
import { gql } from 'graphql-request';
import { For, Show, Suspense } from 'solid-js';
import { useRouteData } from 'solid-start';
import { createServerData$ } from 'solid-start/server';
import { getServerSession } from '../../auth/session';
import { runQuery } from '../../graphql/serverClient';
import { Post } from '../../graphql/types';
import { AddCircle } from '../../icons';

const topicListCss = css({
  width: 'min(70rem, 95vw)',
  flex: 1,
});

export const topicSummaryQuery = gql`
  query TopicSummary {
    channels {
      id
      name
      description
      color
      public
    }
    topics {
      id
      title
      status
    }
  }
`;

export function routeData() {
  return createServerData$(async (_, { request }) => {
    const session = await getServerSession(request);
    return runQuery<{ channels: Channel[]; topics: Post[] }>({
      operationName: 'TopicSummary',
      query: topicSummaryQuery,
      session,
    });
  });
}

export default function TopicSummary() {
  const data = useRouteData<typeof routeData>();
  return (
    <Page.Content alignItems="center">
      <Stack class={topicListCss()} gap="xl">
        <Group gap="md">
          <Menu>
            <Menu.Button>All Channels</Menu.Button>
            <Menu.List>
              <Menu.Item>All Channels</Menu.Item>
              <Suspense>
                <For each={data()?.channels ?? []}>
                  {channel => (
                    <Menu.Item>
                      <Group gap="lg">
                        <ColorSwatch color={channel.color} w={12} h={12} />
                        {channel.name}
                      </Group>
                    </Menu.Item>
                  )}
                </For>
              </Suspense>
            </Menu.List>
          </Menu>
          <Button color="primary">Latest</Button>
          <Spacer />
          <Button>
            <AddCircle width={16} />
            New Topic
          </Button>
        </Group>
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Cell w="60%">Topic</Table.Cell>
              <Table.Cell w="20%"></Table.Cell>
              <Table.Cell>Replies</Table.Cell>
              <Table.Cell>Views</Table.Cell>
              <Table.Cell>Activity</Table.Cell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Topic Example</Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell>0</Table.Cell>
              <Table.Cell>0</Table.Cell>
              <Table.Cell>1d</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        <Suspense>
          <Show when={data()}>
            <EmptyResult>No topics yet!</EmptyResult>
          </Show>
        </Suspense>
      </Stack>
    </Page.Content>
  );
}
