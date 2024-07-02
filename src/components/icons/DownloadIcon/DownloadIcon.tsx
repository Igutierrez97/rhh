import * as React from "react";
import { SVGProps } from "react";

interface SvgDownloadProps extends SVGProps<SVGSVGElement> {
  href?: string;
}

const SvgComponent: React.FC<SvgDownloadProps> = ({ href, ...rest }) => {
  const svgProps = {
    ...rest,
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 1920 1920",
    width: "20",
    height: "20",
    ...(href && { style: { cursor: "pointer" }, onClick: () => window.open(href, "_blank") }),
  };

  return (
    <svg {...svgProps}>
      <path
        fillRule="evenodd"
        d="M1764.098 1355.412 1920 1511.314l-363.073 363.073H363.073L0 1511.314l155.902-155.902 298.463 298.463h1011.27l298.463-298.463ZM1070.333 0v949.967l250.502-250.612 155.902 155.902-518.975 518.975-518.976-518.975 155.902-155.902 255.023 255.022V0h220.622Z"
      />
    </svg>
  );
};

export default SvgComponent;
