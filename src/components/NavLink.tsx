import { A, useMatch } from '@solidjs/router';
import { Nav } from 'dolmen';
import { ParentComponent } from 'solid-js';

interface Props {
  href: string;
}

export const NavLink: ParentComponent<Props> = props => {
  const active = useMatch(() => props.href);
  return (
    <Nav.Link as={A} href={props.href} active={Boolean(active())}>
      {props.children}
    </Nav.Link>
  );
};
