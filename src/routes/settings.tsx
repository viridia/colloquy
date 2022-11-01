import { Outlet } from 'solid-start';
import { Breadcrumbs, Page } from 'dolmen';
import { AppHeader } from '../components/AppHeader';

export default function Settings() {
  return (
    <Page>
      <AppHeader breadcrumbs={[<Breadcrumbs.Item>Settings</Breadcrumbs.Item>]} />
      <Outlet />
    </Page>
  );
}
