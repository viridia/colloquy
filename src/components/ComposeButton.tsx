import { Button } from 'dolmen';
import { VoidComponent } from 'solid-js';
import { useSearchParams } from 'solid-start';
import { useClientSession } from '../auth/sessionContext';
import { AddCircle } from '../icons';

export const ComposeButton: VoidComponent = () => {
  const session = useClientSession();
  const [, setSearchParams] = useSearchParams<{ compose: string }>();

  return (
    <Button
      disabled={!session.isSignedIn}
      onClick={() => {
        setSearchParams({ compose: 'open' });
      }}
    >
      <AddCircle width={16} />
      New Topic
    </Button>
  );
};
