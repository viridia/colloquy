import { JSX } from 'solid-js';
const SvgFormatItalic = (props: JSX.SvgSVGAttributes<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={24} width={24} viewBox="0 0 24 24" {...props}>
    <path
      fill="var(--icon-color)"
      d="M5.25 19.55v-2.1h3.425l4.35-10.9H9.6v-2.1h9.15v2.1h-3.425l-4.35 10.9H14.4v2.1Z"
    />
  </svg>
);
export default SvgFormatItalic;
