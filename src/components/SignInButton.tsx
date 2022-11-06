import { Button, createDialogState } from 'dolmen';
import { lazy, Show, VoidComponent } from 'solid-js';

const SignInDialog = lazy(() => import('./SignInDialog'));

export const SignInButton: VoidComponent = () => {
  const dialogState = createDialogState();
  return (
    <>
      <Button color="primary" onClick={() => dialogState.setOpen(true)}>
        Sign In
      </Button>
      <Show when={dialogState.visible}>
        <SignInDialog {...dialogState.modalProps} />
      </Show>
    </>
  );
};
