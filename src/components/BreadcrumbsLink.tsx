import { A } from '@solidjs/router';
import { Breadcrumbs } from 'dolmen';
import { ParentComponent } from 'solid-js';

// const linkCss = css({
//   textDecoration: 'none',
//   color: '$textLink',
//   fontWeight: 'normal',

//   '&:hover': {
//     textDecoration: 'underline',
//   },
// });

interface Props {
  href: string;
}

export const BreadcrumbsLink: ParentComponent<Props> = props => {
  return (
    <Breadcrumbs.Link as={A} href={props.href}>
      {props.children}
    </Breadcrumbs.Link>
  );
};
