import { JSX } from 'solid-js';
const SvgBookmark = (props: JSX.SvgSVGAttributes<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={24} width={24} viewBox="0 0 24 24" {...props}>
    <path
      fill="var(--icon-color)"
      d="M5 21V5q0-.825.588-1.413Q6.175 3 7 3h10q.825 0 1.413.587Q19 4.175 19 5v16l-7-3Zm2-3.05 5-2.15 5 2.15V5H7ZM7 5h10-5Z"
    />
  </svg>
);
export default SvgBookmark;
