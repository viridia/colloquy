import { useLocation, useNavigate } from '@solidjs/router';
import { Breadcrumbs, BreadcrumbsItem, createDialogState, css, Menu, Page, Spacer } from 'dolmen';
import { createEffect, JSX, lazy, ParentComponent, Show, Suspense, VoidComponent } from 'solid-js';
import { createServerAction$, redirect } from 'solid-start/server';
import { getSessionStorage } from '../auth/session';
import { useClientSession } from '../auth/sessionContext';
import { BreadcrumbsLink } from './BreadcrumbsLink';
import { DarkModeToggle } from './DarkModeToggle';
import { SignInButton } from './SignInButton';

const avatarCss = css({
  display: 'flex',
  alignItems: 'center',
  alignSelf: 'center',
  fontSize: '0.8rem',
  justifyContent: 'center',
});

const NavMenuItem: ParentComponent<{ href: string }> = props => {
  const navigate = useNavigate();
  return <Menu.Item onClick={() => navigate(props.href)}>{props.children}</Menu.Item>;
};

const CreateProfileDialog = lazy(() => import('./CreateProfileDialog'));

interface AppHeaderProps {
  breadcrumbs?: JSX.Element[];
}

// TODO: Replace title with name of forum. (site params)
export const AppHeader: VoidComponent<AppHeaderProps> = props => {
  const profileDialogState = createDialogState();
  const session = useClientSession();
  const location = useLocation();

  const [, logout] = createServerAction$(async (_, { request }) => {
    const storage = getSessionStorage();
    const session = await storage.getSession(request.headers.get('Cookie'));
    return redirect('/', {
      headers: {
        'Set-Cookie': await storage.destroySession(session),
      },
    });
  });

  createEffect(() => {
    profileDialogState.setOpen(session.needsProfile);
  });

  return (
    <Page.Header gap="md">
      <Breadcrumbs>
        <Show
          when={location.pathname !== '/' && location.pathname !== '/t'}
          fallback={<BreadcrumbsItem>Colloquy</BreadcrumbsItem>}
        >
          <BreadcrumbsLink href="/t">Colloquy</BreadcrumbsLink>
        </Show>
        {props.breadcrumbs ?? []}
      </Breadcrumbs>
      <Spacer />
      <DarkModeToggle />
      <Show when={profileDialogState.visible}>
        <Suspense>
          <CreateProfileDialog {...profileDialogState.modalProps} onCancel={() => logout()} />
        </Suspense>
      </Show>
      <Suspense>
        <Show when={session?.email} fallback={<SignInButton />}>
          <Menu>
            <Menu.Button icon round>
              <span class={avatarCss()}>DPJ</span>
            </Menu.Button>
            <Menu.List placement="bottom-end">
              <NavMenuItem href="/u/me">Profile&hellip;</NavMenuItem>
              <NavMenuItem href="/settings">Settings&hellip;</NavMenuItem>
              <NavMenuItem href="/admin">Site Admin&hellip;</NavMenuItem>
              <Menu.Divider />
              <Menu.Item onClick={() => logout()}>Sign Out</Menu.Item>
            </Menu.List>
          </Menu>
        </Show>
      </Suspense>
    </Page.Header>
  );
};
