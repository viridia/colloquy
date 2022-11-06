import { Alert, Button, css, CssTransitionState, Modal, theme } from 'dolmen';
import { createSignal, Show, VoidComponent } from 'solid-js';
import { createRouteAction, redirect } from 'solid-start';
import gitHubIcon from '../images/github.png';
import googleIcon from '../images/google.png';
import discordIcon from '../images/discord.png';

interface Props {
  state: CssTransitionState;
  onClose: () => void;
}

const githubThemeCss = css({
  [theme.colors.btnPrimary.variable]: '#484848',
});

const discordThemeCss = css({
  [theme.colors.btnPrimary.variable]: '#5865F2',
});

const googleThemeCss = css({
  [theme.colors.btnPrimary.variable]: '#bd2c00',
});

const SignInDialog: VoidComponent<Props> = props => {
  const [error, setError] = createSignal('');

  const [_, login] = createRouteAction(async (provider: string) => {
    try {
      const resp = await fetch(
        '/_/authstart?' +
          new URLSearchParams({
            provider,
          })
      );
      if (resp.status !== 200) {
        setError(`Error code: ${resp.status}: ${resp.statusText}`);
        return;
      }
      const body = await resp.json();
      if (body.url) {
        return redirect(body.url);
      }
      setError('Malformed server response - no url.');
    } catch (e) {
      setError((e as Error).message);
    }
  });

  return (
    <Modal.Dialog
      state={props.state}
      onClose={props.onClose}
      withClose
      size="xs"
      aria-label="Sign In"
    >
      <Modal.Header>Sign In</Modal.Header>
      <Modal.Body gap="xl">
        <Button color="primary" class={githubThemeCss()} onClick={() => login('github')}>
          <img src={gitHubIcon} width={16} />
          Login with <b>GitHub</b>
        </Button>
        <Button color="primary" class={discordThemeCss()} onClick={() => login('discord')}>
          <img src={discordIcon} width={16} />
          Login with <b>Discord</b>
        </Button>
        <Button color="primary" class={googleThemeCss()} onClick={() => login('google')}>
          <img src={googleIcon} width={16} />
          Login with <b>Google</b>
        </Button>
        <Show when={error()}>
          <Alert severity="error">{error()}</Alert>
        </Show>
      </Modal.Body>
    </Modal.Dialog>
  );
};

export default SignInDialog;
