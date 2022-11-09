import { Navigate, Outlet } from 'solid-start';
import { Breadcrumbs, Page } from 'dolmen';
import { AppHeader } from '../components/AppHeader';
import { useClientSession } from '../auth/sessionContext';
import { Show } from 'solid-js';

export default function Admin() {
  const session = useClientSession();
  return (
    <Page>
      <Show when={session && !session.isSignedIn}>
        <Navigate href="/t" />
      </Show>
      <AppHeader breadcrumbs={[<Breadcrumbs.Item>Admin</Breadcrumbs.Item>]} />
      <Outlet />
    </Page>
  );
}
