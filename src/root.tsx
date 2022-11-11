// @refresh reload
import { getCssText } from 'dolmen';
import { Show, Suspense } from 'solid-js';
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
import './root.css';

export default function Root() {
  const userSettings = createUserSettings();
  const session = createServerData$(async (_, { request }) => {
    return getClientSession(request);
  });

  return (
    <UserSettingsContext.Provider value={userSettings}>
      <GraphQLContext.Provider value={graphQLClient}>
        <Html lang="en" classList={{ [dark.className]: userSettings[0].theme === 'dark' }}>
          <Head>
            <Title>{session()?.boardName}</Title>
            <Meta charset="utf-8" />
            <Meta name="viewport" content="width=device-width, initial-scale=1" />
            <style id="stitches" innerHTML={getCssText()} />
          </Head>
          <Body>
            <ErrorBoundary>
              <Suspense>
                <Show when={session()}>
                  <SessionContext.Provider value={session()}>
                    <Routes>
                      <FileRoutes />
                    </Routes>
                  </SessionContext.Provider>
                </Show>
              </Suspense>
            </ErrorBoundary>
            <Scripts />
          </Body>
        </Html>
      </GraphQLContext.Provider>
    </UserSettingsContext.Provider>
  );
}
