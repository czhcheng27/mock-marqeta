export const HeroBackgroundWhite = () => {
  return (
    <div className="absolute left-0 bottom-0 w-full z-0 pointer-events-none">
      <svg
        viewBox="0 0 2120 354"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-88.5 block"
        preserveAspectRatio="none"
        style={{ transform: "translate3d(0, 0, 0)" }}
      >
        <defs>
          <filter
            x="-3.5%"
            y="-26.9%"
            width="107.1%"
            height="145.5%"
            filterUnits="objectBoundingBox"
            id="ba"
          >
            <feOffset dy="-15" in="SourceAlpha" result="shadowOffsetOuter1" />
            <feGaussianBlur
              stdDeviation="22.5"
              in="shadowOffsetOuter1"
              result="shadowBlurOuter1"
            />
            <feColorMatrix
              values="0 0 0 0 0.0824864865 0 0 0 0 0.076 0 0 0 0 0.124 0 0 0 0.02 0"
              in="shadowBlurOuter1"
            />
          </filter>
          <path
            d="M219 192.265L0 272.89V354h2120V202.903l-261-31.661L695.435 35.145a150 150 0 00-68.942 8.108L219 192.265z"
            id="bb"
          />
        </defs>
        <g fill="none" fillRule="evenodd">
          <use fill="#000" filter="url(#ba)" xlinkHref="#bb" />
          <use fill="#FFF" xlinkHref="#bb" />
        </g>
      </svg>
    </div>
  );
};
