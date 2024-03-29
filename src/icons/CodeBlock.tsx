import { JSX } from 'solid-js';
const SvgCodeBlock = (props: JSX.SvgSVGAttributes<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={24} width={24} viewBox="0 0 24 24" {...props}>
    <path
      fill="var(--icon-color)"
      d="m8 18-6-6 6-6 1.425 1.425-4.6 4.6L9.4 16.6Zm8 0-1.425-1.425 4.6-4.6L14.6 7.4 16 6l6 6Z"
    />
  </svg>
);
export default SvgCodeBlock;
