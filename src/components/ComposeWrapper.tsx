import { SplitPane } from 'dolmen/dist/mjs';
import { createMemo, lazy, Match, ParentComponent, Show, Switch } from 'solid-js';
import { useSearchParams } from 'solid-start';
import { useUserSettings } from '../hooks/createUserSettings';

const ComposePane = lazy(() => import('./ComposeEditor'));

interface Props {
  mode?: 'topic' | 'reply' | 'message';
}

export const ComposeWrapper: ParentComponent<Props> = props => {
  const [params] = useSearchParams<{ compose: string }>();
  const [settings, setSettings] = useUserSettings();

  const positions = createMemo(() => {
    const size = settings.composeSize ?? 0.4;
    if (settings.composeSide === 'left') {
      return [size];
    } else {
      return [1 - size];
    }
  });

  const setPositions = (positions: number[]) => {
    const size = positions[0];
    if (settings.composeSide === 'left') {
      setSettings('composeSize', size);
    } else {
      setSettings('composeSize', 1 - size);
    }
  };

  return (
    <Show when={params.compose} fallback={props.children}>
      <Switch>
        <Match when={settings.composeSide === 'bottom'}>
          <SplitPane.Controlled
            direction="vertical"
            positions={positions()}
            setPositions={setPositions}
          >
            {props.children}
            <ComposePane mode={props.mode} />
          </SplitPane.Controlled>
        </Match>
        <Match when={settings.composeSide === 'left'}>
          <SplitPane.Controlled
            direction="horizontal"
            positions={positions()}
            setPositions={setPositions}
          >
            <ComposePane mode={props.mode} />
            {props.children}
          </SplitPane.Controlled>
        </Match>
        <Match when={true}>
          <SplitPane.Controlled
            direction="horizontal"
            positions={positions()}
            setPositions={setPositions}
          >
            {props.children}
            <ComposePane mode={props.mode} />
          </SplitPane.Controlled>
        </Match>
      </Switch>
    </Show>
  );
};
