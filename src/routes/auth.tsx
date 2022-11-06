import { Page } from 'dolmen';
import { Outlet } from 'solid-start';
import { AppHeader } from '../components/AppHeader';

export default function Channels() {
  return (
    <Page>
      <AppHeader />
      <Outlet />
    </Page>
  );
}
