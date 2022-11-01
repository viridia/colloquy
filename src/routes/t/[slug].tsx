import { useParams } from 'solid-start';

export default function ThreadView() {
  const params = useParams<{ slug: string }>();

  return <div>Thread {params.slug}</div>;
}
