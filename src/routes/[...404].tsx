import { Page } from 'dolmen';
import { A } from 'solid-start';
import { AppHeader } from '../components/AppHeader';

export default function NotFound() {
  return (
    <Page>
      <AppHeader />
      <h1 class="font-bold text-xl">Page Not Found</h1>
      <A href="/">Back to safety&hellip;</A>
    </Page>
  );
}
