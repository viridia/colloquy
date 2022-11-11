import { Outlet } from 'solid-start';
import { Page } from 'dolmen';
import { AppHeader } from '../components/AppHeader';

export default function Topics() {
  return (
    <Page>
      <AppHeader />
      <Outlet />
    </Page>
  );
}
