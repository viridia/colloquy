// @refresh reload
import { getCssText } from 'dolmen';
import { Suspense } from 'solid-js';
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
} from 'solid-start';
import { createUserSettings, UserSettingsContext } from './hooks/createUserSettings';
import { dark } from 'dolmen';
import { createServerData$ } from 'solid-start/server';
import { graphQLClient, GraphQLContext } from './graphql/client';
import { getClientSession } from './auth/session';
import { SessionContext } from './auth/sessionContext';
// import "./root.css";

export default function Root() {
  const userSettings = createUserSettings();
  const session = createServerData$(async (_, { request }) => {
    return await getClientSession(request);
  });

  return (
    <UserSettingsContext.Provider value={userSettings}>
      <GraphQLContext.Provider value={graphQLClient}>
        <Html lang="en" classList={{ [dark.className]: userSettings[0].theme === 'dark' }}>
          <Head>
            <Title>Colloquy</Title>
            <Meta charset="utf-8" />
            <Meta name="viewport" content="width=device-width, initial-scale=1" />
            <style id="stitches" innerHTML={getCssText()} />
          </Head>
          <Body>
            <ErrorBoundary>
              <Suspense fallback={<div>Loading</div>}>
                <SessionContext.Provider value={session()}>
                  <Routes>
                    <FileRoutes />
                  </Routes>
                </SessionContext.Provider>
              </Suspense>
            </ErrorBoundary>
            <Scripts />
          </Body>
        </Html>
      </GraphQLContext.Provider>
    </UserSettingsContext.Provider>
  );
}
