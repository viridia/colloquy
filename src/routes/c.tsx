import { useRouteData } from 'solid-start';
import { createServerData$ } from 'solid-start/server';
import { Page } from 'dolmen';
import { fetchChannels } from '../db/client';
import { AppHeader } from '../components/AppHeader';
// import { useSession } from '../auth/sessionContext';

export function routeData() {
  return createServerData$(async (_, { request }) => {

    // await fetchUsers();
    const channels = await fetchChannels();

    // if (!user) {
    //   throw redirect('/login');
    // }

    return { channels };
  });
}

export default function Channels() {
  // const session = useSession();
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
