import * as React from "react"
import { SVGProps } from "react"
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={800}
    height={800}
    viewBox="0 0 512 512"
    {...props}
  >
    <path d="m70.2 337.4 104.4 104.4L441.5 175 337 70.5 70.2 337.4zM.6 499.8c-2.3 9.3 2.3 13.9 11.6 11.6L151.4 465 47 360.6.6 499.8zM487.9 24.1c-46.3-46.4-92.8-11.6-92.8-11.6-7.6 5.8-34.8 34.8-34.8 34.8l104.4 104.4s28.9-27.2 34.8-34.8c0 0 34.8-46.3-11.6-92.8z" />
  </svg>
)
export default SvgComponent

