import { Button } from 'dolmen';
import { Show } from 'solid-js';
import { useUserSettings } from '../hooks/createUserSettings';
import { DarkMode, LightMode } from '../icons';

export function DarkModeToggle() {
  const [settings, setSettings] = useUserSettings();

  return (
    <Button
      icon
      color="subtle"
      aria-label={settings.theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
      onClick={() => {
        setSettings(s => ({ theme: s.theme === 'dark' ? 'light' : 'dark' }));
      }}
    >
      <Show when={settings.theme === 'dark'} fallback={<LightMode />}>
        <DarkMode />
      </Show>
    </Button>
  );
}
