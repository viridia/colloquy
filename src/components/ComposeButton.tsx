import { Button } from 'dolmen';
import { VoidComponent } from 'solid-js';
import { useSearchParams } from 'solid-start';
import { AddCircle } from '../icons';

export const ComposeButton: VoidComponent = () => {
  const [, setSearchParams] = useSearchParams<{ compose: string }>();

  return (
    <Button
      onClick={() => {
        setSearchParams({ compose: 'open' });
      }}
    >
      <AddCircle width={16} />
      New Topic
    </Button>
  );
};
