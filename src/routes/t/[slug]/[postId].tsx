import {
  Avatar,
  css,
  Group,
  Page,
  Stack,
  stackCss,
  headerCss,
  cx,
  Spacer,
  theme,
  Card,
  ColorSwatch,
  Text,
  Button,
} from 'dolmen';
import { gql } from 'graphql-request';
import { For, Show, Suspense } from 'solid-js';
import { useRouteData } from 'solid-start';
import { createServerData$ } from 'solid-start/server';
import { getServerSession } from '../../../auth/session';
import { ComposeWrapper } from '../../../components/ComposeWrapper';
import { RelativeDate } from '../../../components/RelativeDate';
import { runQuery } from '../../../graphql/serverClient';
import type { Post } from '../../../graphql/types';
import { Bookmark, InsertLink, Like, Reply } from '../../../icons';

const topicListCss = css({
  width: 'min(50rem, 95%)',
  flex: 1,
});

const postCss = css({
  display: 'flex',
  flexDirection: 'row',
  gap: '12px',
  paddingBottom: '1rem',
  borderBottom: `1px solid ${theme.colors.fieldBg.computedValue}`,
  marginTop: '1rem',
});

const threadTitleCss = css({
  margin: '0 0 4px 0',
});

export const threadQuery = gql`
  query ThreadQuery($postId: Int!) {
    thread(postId: $postId) {
      id
      title
      body
      status
      createdAt
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
      replies {
        id
        title
        body
        status
        slug
        updatedAt
      }
    }
  }
`;

export function routeData({ params }) {
  return createServerData$(
    async ([, id], { request }) => {
      const session = await getServerSession(request);
      return runQuery<{ thread: Post }>({
        operationName: 'ThreadQuery',
        query: threadQuery,
        session,
        variables: {
          postId: Number(id),
        },
      });
    },
    { key: () => ['thread', params.postId] }
  );
}

export default function ThreadView() {
  // const params = useParams<{ postId: string }>();
  const data = useRouteData<typeof routeData>();

  return (
    <ComposeWrapper mode="reply">
      <Page.Content alignItems="center">
        <Suspense>
          <Show when={data()?.thread} keyed>
            {post => (
              <Stack class={topicListCss()}>
                <h1 class={threadTitleCss()}>{post.title}</h1>
                <Group gap="xl">
                  <For each={post.channels}>
                    {channel => (
                      <Group gap="md">
                        <ColorSwatch color={channel.color} classList={cx({ w: 12, h: 12 })} />
                        {channel.name}
                      </Group>
                    )}
                  </For>
                </Group>
                <section class={postCss()}>
                  <Avatar src={post.author.avatar} size="lg">
                    {post.author.displayName}
                  </Avatar>
                  <section classList={cx(stackCss(), { flex: 1 })}>
                    <Group classList={cx({ mb: '1rem' })}>
                      <header classList={cx(headerCss())}>{post.author.displayName}</header>
                      <Spacer />
                      <RelativeDate from={post.createdAt} />
                    </Group>
                    <div>{post.body}</div>
                    <Group justifyContent="end" gap="lg" classList={cx({ my: 'xl' })}>
                      <Button color="subtle" icon>
                        <Like />
                      </Button>
                      <Button color="subtle" icon>
                        <InsertLink />
                      </Button>
                      <Button color="subtle" icon>
                        <Bookmark />
                      </Button>
                      <Button color="subtle">
                        <Reply />
                        Reply
                      </Button>
                    </Group>
                    <Card>
                      <Card.Content flexDirection="row" gap="xl">
                        <Stack alignItems="center">
                          <Text size="sm">created</Text>
                          <RelativeDate from={post.createdAt} />
                        </Stack>
                        <Stack alignItems="center">
                          <Text size="sm">last reply</Text>
                          <RelativeDate from={post.updatedAt} />
                        </Stack>
                        <Stack alignItems="center">
                          <Text size="xl">0</Text>
                          <Text size="sm">replies</Text>
                        </Stack>
                        <Stack alignItems="center">
                          <Text size="xl">0</Text>
                          <Text size="sm">views</Text>
                        </Stack>
                        <Stack alignItems="center">
                          <Text size="xl">0</Text>
                          <Text size="sm">users</Text>
                        </Stack>
                        <Stack alignItems="center">
                          <Text size="xl">0</Text>
                          <Text size="sm">likes</Text>
                        </Stack>
                      </Card.Content>
                    </Card>
                  </section>
                </section>
              </Stack>
            )}
          </Show>
        </Suspense>
      </Page.Content>
    </ComposeWrapper>
  );
}
