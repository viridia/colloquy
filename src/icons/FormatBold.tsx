import { JSX } from 'solid-js';
const SvgFormatBold = (props: JSX.SvgSVGAttributes<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={24} width={24} viewBox="0 0 24 24" {...props}>
    <path
      fill="var(--icon-color)"
      d="M6.7 18.3V3.9h6q1.775 0 3.088 1.062Q17.1 6.025 17.1 7.7q0 .95-.487 1.775-.488.825-1.363 1.25v.175q1.075.375 1.712 1.288.638.912.638 2.062 0 1.775-1.425 2.913Q14.75 18.3 12.85 18.3Zm2.95-8.625h2.725q.725 0 1.275-.463.55-.462.55-1.137 0-.7-.55-1.163-.55-.462-1.275-.462H9.65Zm0 6.025h2.95q.8 0 1.4-.5.6-.5.6-1.275 0-.775-.6-1.275-.6-.5-1.4-.5H9.65Z"
    />
  </svg>
);
export default SvgFormatBold;
