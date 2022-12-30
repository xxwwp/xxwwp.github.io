import React from "react";

export default function IconEMail({ color }: { color?: string }) {
  return (
    <svg
      width="20px"
      height="16px"
      viewBox="0 0 20 16"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <title>email</title>
      <desc>Created with Sketch.</desc>
      <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Outlined" transform="translate(-918.000000, -1220.000000)">
          <g id="Communication" transform="translate(100.000000, 1162.000000)">
            <g id="Outlined-/-Communication-/-email" transform="translate(816.000000, 54.000000)">
              <g>
                <polygon id="Path" points="0 0 24 0 24 24 0 24"></polygon>
                <path
                  d="M22,6 C22,4.9 21.1,4 20,4 L4,4 C2.9,4 2,4.9 2,6 L2,18 C2,19.1 2.9,20 4,20 L20,20 C21.1,20 22,19.1 22,18 L22,6 Z M20,6 L12,11 L4,6 L20,6 Z M20,18 L4,18 L4,8 L12,13 L20,8 L20,18 Z"
                  id="🔹-Icon-Color"
                  fill={color}
                ></path>
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
