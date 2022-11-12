import {
  Alert,
  Button,
  ButtonGroup,
  ColorSwatch,
  css,
  Group,
  Header,
  Input,
  Select,
  Spacer,
  TextArea,
} from 'dolmen';
import { createResource, createSignal, Show, Suspense, useContext, VoidComponent } from 'solid-js';
import { createRouteAction, useSearchParams } from 'solid-start';
import { decodeErrors, gql, GraphQLContext } from '../graphql/client';
import { channelsQuery } from '../graphql/queries';
import { MutationCreateTopicArgs, Post, Query } from '../graphql/types';
import { useUserSettings } from '../hooks/createUserSettings';
import {
  AddCircle,
  AttachFile,
  BlockQuote,
  CodeBlock,
  FormatBold,
  FormatItalic,
  ListBulleted,
  ListNumbered,
  PanelBottom,
  PanelLeft,
  PanelRight,
} from '../icons';

const formCss = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  flex: 1,
  alignItems: 'stretch',
  margin: '12px',
});

export const createTopic = gql`
  mutation CreateTopic($channel: String!, $post: PostInput!) {
    createTopic(channel: $channel, post: $post) {
      id
    }
  }
`;

interface Props {
  mode?: 'topic' | 'reply' | 'message';
}

export const ComposeEditor: VoidComponent<Props> = () => {
  const [settings, setSettings] = useUserSettings();
  const [, setSearchParams] = useSearchParams<{ compose: string }>();
  const [channel, setChannel] = createSignal<string>('');
  const [title, setTitle] = createSignal('');
  const [body, setBody] = createSignal('');
  const gqlClient = useContext(GraphQLContext);
  const [error, setError] = createSignal('');

  const [channels] = createResource(async () => {
    return await gqlClient.request<Pick<Query, 'channels'>>(channelsQuery);
  });

  const [creating, { Form }] = createRouteAction(async (formData: FormData) => {
    setError('');
    try {
      await gqlClient.request<Post, MutationCreateTopicArgs>(createTopic, {
        channel: channel(),
        post: {
          title: formData.get('title') as string,
          body: formData.get('body') as string,
        },
      });

      setSearchParams({ compose: '' });
    } catch (clientError) {
      setError(decodeErrors(clientError.response));
    }
  });

  return (
    <Form class={formCss()}>
      <Group>
        <Header>Create new Topic</Header>
        <Spacer />
        <Button
          icon
          size="xxs"
          color="subtle"
          selected={settings.composeSide === 'left'}
          onClick={() => setSettings({ composeSide: 'left', composeSize: undefined })}
        >
          <PanelLeft />
        </Button>
        <Button
          icon
          size="xxs"
          color="subtle"
          selected={settings.composeSide === 'bottom'}
          onClick={() => setSettings({ composeSide: 'bottom', composeSize: undefined })}
        >
          <PanelBottom />
        </Button>
        <Button
          icon
          size="xxs"
          color="subtle"
          selected={settings.composeSide === 'right'}
          onClick={() => setSettings({ composeSide: 'right', composeSize: undefined })}
        >
          <PanelRight />
        </Button>
      </Group>
      <Group gap="md">
        <Suspense>
          <Show when={!channels.loading}>
            <Select
              placeholder="channel..."
              selected={channel()}
              onSelect={channel => setChannel(channel)}
              options={(channels().channels ?? []).map(channel => ({
                value: channel.id,
                label: (
                  <Group gap="lg">
                    <ColorSwatch color={channel.color} w={12} h={12} />
                    {channel.name}
                  </Group>
                ),
              }))}
            />
          </Show>
        </Suspense>
        <Input
          placeholder="title..."
          name="title"
          flex={1}
          minWidth="5rem"
          value={title()}
          onInput={e => setTitle(e.currentTarget.value)}
        />
      </Group>
      <Group gap="md" flexWrap="wrap">
        <ButtonGroup>
          <Button>
            <FormatBold width={20} />
          </Button>
          <Button>
            <FormatItalic width={20} />
          </Button>
          <Button>
            <CodeBlock width={20} />
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button>
            <CodeBlock width={20} />
          </Button>
          <Button>
            <BlockQuote width={20} />
          </Button>
          <Button>
            <AttachFile width={20} />
          </Button>
          <Button>
            <ListBulleted width={20} />
          </Button>
          <Button>
            <ListNumbered width={20} />
          </Button>
        </ButtonGroup>
      </Group>
      <TextArea name="body" flex={1} value={body()} onInput={e => setBody(e.currentTarget.value)} />
      <Show when={error()}>
        <Alert severity="error">{error()}</Alert>
      </Show>
      <Group gap="md" justifyContent="end">
        <Button
          onClick={() => {
            setSearchParams({ compose: '' });
          }}
          type="button"
          disabled={creating.pending}
        >
          Close
        </Button>
        <Button
          color="primary"
          type="submit"
          disabled={!channel() || title().length === 0 || body().length === 0 || creating.pending}
        >
          <AddCircle width={16} />
          Create Topic
        </Button>
      </Group>
    </Form>
  );
};

export default ComposeEditor;
