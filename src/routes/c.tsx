import { useRouteData } from 'solid-start';
import { createServerData$ } from 'solid-start/server';
import { getUser } from '~/db/session';
import { Page } from 'dolmen';
import { fetchChannels, fetchUsers } from '../db/client';
import { AppHeader } from '../components/AppHeader';

export function routeData() {
  return createServerData$(async (_, { request }) => {
    const user = await getUser(request);

    await fetchUsers();
    const channels = await fetchChannels();

    // if (!user) {
    //   throw redirect('/login');
    // }

    return { user, channels };
  });
}

export default function Channels() {
  const data = useRouteData<typeof routeData>();

  return (
    <Page>
      <AppHeader />
      <ul>
        <li>Fake</li>
        {data().channels.map(channel => (
          <li>{channel.name}</li>
        ))}
      </ul>
    </Page>
  );
}
