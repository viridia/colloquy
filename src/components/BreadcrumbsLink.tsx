import { A } from '@solidjs/router';
import { BreadcrumbsItem, css } from 'dolmen';
import { ParentComponent } from 'solid-js';

const linkCss = css({
  textDecoration: 'none',
  color: '$textLink',
  fontWeight: 'normal',

  '&:hover': {
    textDecoration: 'underline',
  },
});

interface Props {
  href: string;
}

export const BreadcrumbsLink: ParentComponent<Props> = props => {
  return (
    <BreadcrumbsItem>
      <A class={linkCss()} href={props.href}>
        {props.children}
      </A>
    </BreadcrumbsItem>
  );
};
