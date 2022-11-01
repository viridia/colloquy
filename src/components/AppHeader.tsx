import { useLocation, useNavigate } from '@solidjs/router';
import { Breadcrumbs, BreadcrumbsItem, Button, css, Menu, Page, Spacer } from 'dolmen';
import { JSX, ParentComponent, Show, VoidComponent } from 'solid-js';
import { useSession } from '../db/session';
import { BreadcrumbsLink } from './BreadcrumbsLink';
import { DarkModeToggle } from './DarkModeToggle';

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

// TODO: Replace title with name of forum. (site params)
export const AppHeader: VoidComponent<AppHeaderProps> = props => {
  const session = useSession();
  const location = useLocation();
  return (
    <Page.Header gap="md">
      <Breadcrumbs>
        <Show
          when={location.pathname !== '/' && location.pathname !== '/t'}
          fallback={<BreadcrumbsItem>Colloquy</BreadcrumbsItem>}
        >
          <BreadcrumbsLink href="/t">Colloquy</BreadcrumbsLink>
        </Show>
        {props.breadcrumbs}
      </Breadcrumbs>
      <Spacer />
      <DarkModeToggle />
      <Menu>
        <Menu.Button icon round>
          <span class={avatarCss()}>DPJ</span>
        </Menu.Button>
        <Menu.List placement="bottom-end">
          <NavMenuItem href="/u/me">Profile&hellip;</NavMenuItem>
          <NavMenuItem href="/settings">Settings&hellip;</NavMenuItem>
          <NavMenuItem href="/admin">Site Admin&hellip;</NavMenuItem>
          <Menu.Divider />
          <NavMenuItem href="/admin">Sign Out</NavMenuItem>
        </Menu.List>
      </Menu>
      <Show when={session?.username} fallback={<Button color="primary">Sign In</Button>}>
        <Button>Sign Out</Button>
      </Show>
    </Page.Header>
  );
};
