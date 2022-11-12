import { JSX } from 'solid-js';
const SvgFormatH2 = (props: JSX.SvgSVGAttributes<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={24} width={24} viewBox="0 0 24 24" {...props}>
    <path
      fill="var(--icon-color)"
      d="M3 17V7h2v4h4V7h2v10H9v-4H5v4Zm10 0v-4q0-.825.588-1.413Q14.175 11 15 11h4V9h-6V7h6q.825 0 1.413.587Q21 8.175 21 9v2q0 .825-.587 1.412Q19.825 13 19 13h-4v2h6v2Z"
    />
  </svg>
);
export default SvgFormatH2;
