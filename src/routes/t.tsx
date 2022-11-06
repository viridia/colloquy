import { Outlet } from 'solid-start';
import { Page } from 'dolmen';
import { AppHeader } from '../components/AppHeader';

export function routeData() {
  // Nothing
}

export default function Threads() {
  return (
    <Page>
      <AppHeader />
      <Outlet />
    </Page>
  );
}
