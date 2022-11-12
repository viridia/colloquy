import { JSX } from 'solid-js';
const SvgBlockQuote = (props: JSX.SvgSVGAttributes<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={24} width={24} viewBox="0 0 24 24" {...props}>
    <path
      fill="var(--icon-color)"
      d="M15 11h3V8h-3Zm-9 0h3V8H6Zm9 6 2-4h-4V6h7v7l-2 4Zm-9 0 2-4H4V6h7v7l-2 4Zm1.5-7.5Zm9 0Z"
    />
  </svg>
);
export default SvgBlockQuote;
