// components/LibraryLogo.tsx

import React from "react";

const LibraryLogo = () => (
  <svg
    width="220"
    height="40"
    viewBox="0 0 220 40"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
  >
    {/* Books and Rack */}
    <g fill="#1E6F72">
      {/* Rack */}
      <rect x="5" y="30" width="30" height="4" rx="1" />
      <rect x="8" y="34" width="24" height="3" rx="1" />

      {/* Books */}
      <rect
        x="10"
        y="8"
        width="6"
        height="22"
        rx="1"
        transform="rotate(-10 10 8)"
      />
      <rect x="18" y="6" width="6" height="24" rx="1" />
      <rect
        x="26"
        y="8"
        width="6"
        height="22"
        rx="1"
        transform="rotate(10 26 8)"
      />
    </g>

    {/* Text */}
    <text
      x="45"
      y="26"
      fill="#1E6F72"
      fontFamily="Arial, sans-serif"
      fontSize="14"
      fontWeight="normal"
    >
      Library Management System
    </text>
  </svg>
);

export default LibraryLogo;
