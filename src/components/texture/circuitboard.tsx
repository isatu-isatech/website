interface CircuitBoardTextureProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  patternSize?: number;
}

export function CircuitBoardTexture({
  color = "currentColor",
  className = "",
  ...props
}: CircuitBoardTextureProps) {
  const baseSize = 40;
  const scaledSize = baseSize * 1;

  return (
    <svg
      {...props}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
    >
      <defs>
        <pattern
          id={`circuitboard-pattern-1`}
          x="0"
          y="0"
          width={scaledSize}
          height={scaledSize}
          patternUnits="userSpaceOnUse"
        >
          <g
            xmlns="http://www.w3.org/2000/svg"
            id="Page-1"
            fill="none"
            fillRule="evenodd"
          >
            <g id="Artboard-5" fill={color} fillRule="nonzero">
              <path
                id="Combined-Shape"
                d="M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z"
              />
            </g>
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#circuitboard-pattern-1)`} />
    </svg>
  );
}
