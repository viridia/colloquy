import { Outlet } from 'solid-start';
import { createServerData$ } from 'solid-start/server';
import { getUser } from '~/db/session';
import { Page } from 'dolmen';
// import { fetchUsers } from '../db/client';
import { AppHeader } from '../components/AppHeader';

export function routeData() {
  return createServerData$(async (_, { request }) => {
    const user = await getUser(request);

    // await fetchUsers();

    // if (!user) {
    //   throw redirect('/login');
    // }

    return user;
  });
}

export default function Threads() {
  // const user = useRouteData<typeof routeData>();

  return (
    <Page>
      <AppHeader />
      <Outlet />
    </Page>
  );
}
