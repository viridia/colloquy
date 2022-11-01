import { Outlet } from 'solid-start';
import { Breadcrumbs, Page } from 'dolmen';
import { AppHeader } from '../components/AppHeader';

export default function Admin() {
  return (
    <Page>
      <AppHeader breadcrumbs={[<Breadcrumbs.Item>Admin</Breadcrumbs.Item>]} />
      <Outlet />
    </Page>
  );
}
