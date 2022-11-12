import { VoidComponent } from 'solid-js';

interface Props {
  from: Date | string;
}

export const RelativeDate: VoidComponent<Props> = props => {
  const result = () => {
    const from = new Date(props.from);
    const delta = new Date().getTime() - from.getTime();
    const seconds = delta / 1000;
    const minutes = seconds / 60;
    if (minutes < 60) {
      return `${Math.round(minutes)}m`;
    }
    const hours = minutes / 60;
    if (hours < 24) {
      return `${Math.round(hours)}h`;
    }
    const days = hours / 24;
    if (days < 40) {
      return `${Math.round(days)}d`;
    }
    return from.toLocaleDateString(undefined, {
      dateStyle: 'short',
    });
  };

  return <span>{result()}</span>;
};
