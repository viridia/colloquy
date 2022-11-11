import { useLocation, useNavigate } from '@solidjs/router';
import {
  Avatar,
  Breadcrumbs,
  BreadcrumbsItem,
  createDialogState,
  css,
  Menu,
  Page,
  Spacer,
} from 'dolmen';
import { createEffect, JSX, ParentComponent, Show, Suspense, VoidComponent } from 'solid-js';
import { createServerAction$, redirect } from 'solid-start/server';
import { getSessionStorage } from '../auth/session';
import { useClientSession } from '../auth/sessionContext';
import { initials } from '../lib/initials';
import { BreadcrumbsLink } from './BreadcrumbsLink';
import CreateProfileDialog from './CreateProfileDialog';
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

interface AppHeaderProps {
  breadcrumbs?: JSX.Element[];
}

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
    profileDialogState.setOpen(session?.needsProfile);
  });

  return (
    <Page.Header gap="md">
      <Breadcrumbs>
        <Show
          when={location.pathname !== '/' && location.pathname !== '/t'}
          fallback={<BreadcrumbsItem>{session?.boardName}</BreadcrumbsItem>}
        >
          <BreadcrumbsLink href="/t">{session?.boardName}</BreadcrumbsLink>
        </Show>
        {props.breadcrumbs ?? []}
      </Breadcrumbs>
      <Spacer />
      <DarkModeToggle />
      <Show when={profileDialogState.visible}>
        <CreateProfileDialog {...profileDialogState.modalProps} onCancel={() => logout()} />
      </Show>
      <Suspense>
        <Show when={session?.email} fallback={<SignInButton />}>
          <Menu>
            <Menu.Button icon round>
              <Avatar
                class={avatarCss()}
                colorHash={session.email}
                src={session.avatar}
              >
                {session.name ? initials(session.name) : '--'}
              </Avatar>
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
