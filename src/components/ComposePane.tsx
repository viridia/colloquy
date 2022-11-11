import { Button, Group, Select, Spacer, Stack } from 'dolmen';
import { VoidComponent } from 'solid-js';
import { useSearchParams } from 'solid-start';
import { useUserSettings } from '../hooks/createUserSettings';
import { AddCircle } from '../icons';

export const ComposePane: VoidComponent = () => {
  const [settings, setSettings] = useUserSettings();
  const [, setSearchParams] = useSearchParams<{ compose: string }>();

  return (
    <Stack p="xl" alignItems="stretch" flex={1}>
      Compose
      <Select<'left' | 'right' | 'bottom'>
        selected={settings.composeSide}
        onSelect={value => {
          setSettings({ composeSide: value, composeSize: undefined });
        }}
        options={[
          {
            label: 'Left',
            value: 'left',
          },
          {
            label: 'Right',
            value: 'right',
          },
          {
            label: 'Bottom',
            value: 'bottom',
          },
        ]}
      ></Select>
      <Spacer />
      <Group gap="md" justifyContent="end">
        <Button
          onClick={() => {
            setSearchParams({ compose: '' });
          }}
          type="button"
        >
          Close
        </Button>
        <Button color="primary" type="submit">
          <AddCircle />
          Create Topic
        </Button>
      </Group>
    </Stack>
  );
};

export default ComposePane;
