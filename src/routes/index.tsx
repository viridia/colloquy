import { Navigate } from 'solid-start';
// import { createServerData$ } from 'solid-start/server';
// import { getUser } from '~/db/session';

// export function routeData() {
//   return createServerData$(async (_, { request }) => {
//     const user = await getUser(request);

//     // if (!user) {
//     //   throw redirect('/login');
//     // }

//     return user;
//   });
// }

export default function Home() {
  // const user = useRouteData<typeof routeData>();

  return (
    <Navigate href="/t" />
    // <Page>
    //   </Page.Header>
    //   <h1 class="font-bold text-3xl">Hello {user()?.username}</h1>
    //   <h3 class="font-bold text-xl">Message board</h3>
    //   <Form>
    //     <button name="logout" type="submit">
    //       Logout
    //     </button>
    //   </Form>
    // </Page>
  );
}
