import { JSX } from 'solid-js';
const SvgFormatH1 = (props: JSX.SvgSVGAttributes<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={24} width={24} viewBox="0 0 24 24" {...props}>
    <path fill="var(--icon-color)" d="M5 17V7h2v4h4V7h2v10h-2v-4H7v4Zm12 0V9h-2V7h4v10Z" />
  </svg>
);
export default SvgFormatH1;
