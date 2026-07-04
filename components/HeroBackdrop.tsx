export default function HeroBackdrop() {
  return (
    <div className="hero-bg" aria-hidden="true">
      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="hbg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1d1710" />
            <stop offset="55%" stopColor="#14100a" />
            <stop offset="100%" stopColor="#0b0806" />
          </linearGradient>
          <linearGradient id="hgold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#9a7c40" />
            <stop offset="50%" stopColor="#e3c07f" />
            <stop offset="100%" stopColor="#9a7c40" />
          </linearGradient>
          <radialGradient id="hglow" cx="70%" cy="42%" r="55%">
            <stop offset="0%" stopColor="#c6a35a" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#c6a35a" stopOpacity="0" />
          </radialGradient>
          <pattern
            id="hstars"
            width="120"
            height="120"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M60 18 L67 46 L95 53 L67 60 L60 88 L53 60 L25 53 L53 46 Z"
              fill="none"
              stroke="#c6a35a"
              strokeOpacity="0.10"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        <rect width="1600" height="900" fill="url(#hbg)" />
        <rect width="1600" height="900" fill="url(#hstars)" />
        <rect width="1600" height="900" fill="url(#hglow)" />

        {/* Grand Moroccan arch */}
        <g transform="translate(1090, 130)">
          <path
            d="M0 640 L0 300 C0 140 90 30 210 0 C330 30 420 140 420 300 L420 640"
            fill="#0b0806"
            fillOpacity="0.45"
            stroke="url(#hgold)"
            strokeWidth="2.5"
          />
          <path
            d="M30 640 L30 305 C30 165 105 65 210 38 C315 65 390 165 390 305 L390 640"
            fill="none"
            stroke="#c6a35a"
            strokeOpacity="0.4"
            strokeWidth="1.2"
          />
          {/* Caftan silhouette inside the arch */}
          <g transform="translate(210, 150)">
            <path
              d="M0 0 C-14 26 -34 38 -58 46 L-118 78 C-136 88 -146 104 -150 128 L-172 420 L-96 420 L-88 470 L88 470 L96 420 L172 420 L150 128 C146 104 136 88 118 78 L58 46 C34 38 14 26 0 0 Z"
              fill="#1d1710"
              stroke="url(#hgold)"
              strokeWidth="2"
            />
            <path
              d="M0 10 C-6 34 -6 60 0 88 C6 60 6 34 0 10 Z"
              fill="url(#hgold)"
              opacity="0.85"
            />
            <path
              d="M0 88 L0 460"
              stroke="url(#hgold)"
              strokeWidth="1.6"
              strokeDasharray="1 7"
            />
            {[130, 180, 230, 280, 330, 380].map((y) => (
              <g key={y}>
                <circle cx="0" cy={y} r="4.5" fill="none" stroke="#e3c07f" strokeWidth="1" opacity="0.9" />
                <circle cx="0" cy={y} r="1.4" fill="#e3c07f" />
              </g>
            ))}
            <path
              d="M-88 470 C-40 448 40 448 88 470"
              fill="none"
              stroke="url(#hgold)"
              strokeWidth="1.6"
            />
            <path
              d="M-83 458 C-40 438 40 438 83 458"
              fill="none"
              stroke="#c6a35a"
              strokeOpacity="0.5"
              strokeWidth="1"
            />
            {/* Belt */}
            <path
              d="M-52 210 C-20 200 20 200 52 210 L52 232 C20 222 -20 222 -52 232 Z"
              fill="#0b0806"
              stroke="url(#hgold)"
              strokeWidth="1.6"
            />
            <circle cx="0" cy="220" r="7" fill="none" stroke="#e3c07f" strokeWidth="1.4" />
            <circle cx="0" cy="220" r="2.4" fill="#e3c07f" />
          </g>
        </g>

        {/* Secondary smaller arch */}
        <g transform="translate(880, 330)" opacity="0.55">
          <path
            d="M0 440 L0 210 C0 100 60 25 140 0 C220 25 280 100 280 210 L280 440"
            fill="none"
            stroke="#c6a35a"
            strokeOpacity="0.5"
            strokeWidth="1.4"
          />
        </g>

        {/* Fine horizon lines */}
        <line x1="0" y1="770" x2="1600" y2="770" stroke="#c6a35a" strokeOpacity="0.18" />
        <line x1="0" y1="778" x2="1600" y2="778" stroke="#c6a35a" strokeOpacity="0.10" />
      </svg>
    </div>
  );
}
