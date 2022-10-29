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
// import "./root.css";

export default function Root() {
  const userSettings = createUserSettings();

  return (
    <UserSettingsContext.Provider value={userSettings}>
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
              <Routes>
                <FileRoutes />
              </Routes>
            </Suspense>
          </ErrorBoundary>
          <Scripts />
        </Body>
      </Html>
    </UserSettingsContext.Provider>
  );
}
