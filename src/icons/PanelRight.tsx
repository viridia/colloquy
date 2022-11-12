import { JSX } from 'solid-js';
const SvgPanelRight = (props: JSX.SvgSVGAttributes<SVGSVGElement>) => (
  <svg height={18} width={18} xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      style={{
        color: '#000',
      }}
      fill="var(--icon-color)"
      d="M4.5 2A2.506 2.506 0 0 0 2 4.5v9C2 14.876 3.124 16 4.5 16h9c1.376 0 2.5-1.124 2.5-2.5v-9C16 3.124 14.876 2 13.5 2Zm0 1H10v12H4.5c-.84 0-1.5-.66-1.5-1.5v-9C3 3.66 3.66 3 4.5 3Z"
    />
  </svg>
);
export default SvgPanelRight;
