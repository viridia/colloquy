import { SplitPane } from 'dolmen/dist/mjs';
import { createMemo, lazy, Match, ParentComponent, Show, Switch } from 'solid-js';
import { useSearchParams } from 'solid-start';
import { useUserSettings } from '../hooks/createUserSettings';

const ComposePane = lazy(() => import('./ComposePane'));

export const ComposeWrapper: ParentComponent = props => {
  const [params] = useSearchParams<{ compose: string }>();
  const [settings, setSettings] = useUserSettings();

  const positions = createMemo(() => {
    const size = settings.composeSize ?? 0.3;
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
            <ComposePane />
          </SplitPane.Controlled>
        </Match>
        <Match when={settings.composeSide === 'left'}>
          <SplitPane.Controlled
            direction="horizontal"
            positions={positions()}
            setPositions={setPositions}
          >
            <ComposePane />
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
            <ComposePane />
          </SplitPane.Controlled>
        </Match>
      </Switch>
    </Show>
  );
};
