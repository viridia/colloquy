import { Channel } from '@prisma/client';
import {
  Avatar,
  Button,
  ColorSwatch,
  css,
  cx,
  EmptyResult,
  Group,
  Header,
  Menu,
  Page,
  Spacer,
  Stack,
  Table,
  Text,
} from 'dolmen';
import { gql } from 'graphql-request';
import { For, Show, Suspense } from 'solid-js';
import { A, useRouteData } from 'solid-start';
import { createServerData$ } from 'solid-start/server';
import { getServerSession } from '../../auth/session';
import { ComposeButton } from '../../components/ComposeButton';
import { ComposeWrapper } from '../../components/ComposeWrapper';
import { RelativeDate } from '../../components/RelativeDate';
import { runQuery } from '../../graphql/serverClient';
import { Post } from '../../graphql/types';

const topicListCss = css({
  width: 'min(70rem, 95%)',
  flex: 1,
});

const topicNameCss = css({
  color: '$text',
  textDecoration: 'none',
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
      slug
      updatedAt
      channels {
        id
        name
        color
      }
      author {
        username
        displayName
        avatar
      }
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
    <ComposeWrapper mode="topic">
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
                          <ColorSwatch color={channel.color} classList={cx({ w: 12, h: 12 })} />
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
            <ComposeButton />
          </Group>
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Cell classList={cx({ w: '60%' })}>Topic</Table.Cell>
                <Table.Cell classList={cx({ w: '20%' })}></Table.Cell>
                <Table.Cell textAlign="center">Replies</Table.Cell>
                <Table.Cell textAlign="center">Views</Table.Cell>
                <Table.Cell textAlign="center">Activity</Table.Cell>
              </Table.Row>
            </Table.Head>
            <Suspense>
              <Table.Body>
                <For each={data()?.topics ?? []}>
                  {post => (
                    <Table.Row>
                      <Table.Cell>
                        <A class={topicNameCss()} href={`/t/${post.slug}/${post.id}`}>
                          <Header>{post.title}</Header>
                        </A>
                        <div>
                          <For each={post.channels}>
                            {channel => (
                              <Group gap="md">
                                <ColorSwatch color={channel.color} />
                                <Text size="sm">{channel.name}</Text>
                              </Group>
                            )}
                          </For>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <Avatar size="sm" src={post.author.avatar}>
                          {post.author.displayName}
                        </Avatar>
                      </Table.Cell>
                      <Table.Cell textAlign="center">0</Table.Cell>
                      <Table.Cell textAlign="center">0</Table.Cell>
                      <Table.Cell textAlign="center">
                        <RelativeDate from={post.updatedAt} />
                      </Table.Cell>
                    </Table.Row>
                  )}
                </For>
              </Table.Body>
            </Suspense>
          </Table>
          <Suspense>
            <Show when={data() && data().topics.length === 0}>
              <EmptyResult>No topics yet!</EmptyResult>
            </Show>
          </Suspense>
        </Stack>
      </Page.Content>
    </ComposeWrapper>
  );
}
