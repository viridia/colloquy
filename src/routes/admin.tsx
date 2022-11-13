import { Navigate, Outlet } from 'solid-start';
import { Aside, Breadcrumbs, cx, Group, Nav, Page } from 'dolmen';
import { AppHeader } from '../components/AppHeader';
import { useClientSession } from '../auth/sessionContext';
import { Show } from 'solid-js';
import { NavLink } from '../components/NavLink';

export default function Admin() {
  const session = useClientSession();
  return (
    <Page>
      <Show when={session && !session.isSignedIn}>
        <Navigate href="/t" />
      </Show>
      <AppHeader breadcrumbs={[<Breadcrumbs.Item>Admin</Breadcrumbs.Item>]} />
      <Group classList={cx({ flex: 1 })}>
        <Aside classList={cx({ w: '200px', alignSelf: 'stretch' })} alignItems="stretch">
          <Nav>
            <Nav.Title>Site Admin</Nav.Title>
            <NavLink href="/admin/board">Board</NavLink>
            <NavLink href="/admin/channels">Channels</NavLink>
          </Nav>
        </Aside>
        <Outlet />
      </Group>
    </Page>
  );
}
