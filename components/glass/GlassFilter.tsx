'use client'

export function GlassFilter() {
  return (
    <svg
      aria-hidden="true"
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
    >
      <defs>
        {/* Primary glass refraction filter */}
        <filter id="glass-refraction" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.008"
            numOctaves="2"
            seed="5"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="28"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
        </filter>

        {/* Subtle refraction for cards */}
        <filter id="glass-refraction-subtle" x="-3%" y="-3%" width="106%" height="106%" colorInterpolationFilters="sRGB">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.015 0.010"
            numOctaves="2"
            seed="3"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="16"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* Animated refraction — same filter but turbulence animates via JS */}
        <filter id="glass-refraction-animated" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
          <feTurbulence
            id="glass-turbulence"
            type="fractalNoise"
            baseFrequency="0.012 0.008"
            numOctaves="2"
            seed="5"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="28"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* Chromatic aberration: red channel offset */}
        <filter id="chromatic-fringe" colorInterpolationFilters="sRGB">
          <feOffset in="SourceGraphic" dx="1.5" dy="0" result="r-shifted" />
          <feOffset in="SourceGraphic" dx="-1.5" dy="0" result="b-shifted" />
          <feBlend in="r-shifted" in2="b-shifted" mode="screen" />
        </filter>

        {/* Film grain noise */}
        <filter id="film-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="4"
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
          <feBlend in="SourceGraphic" in2="grayNoise" mode="overlay" result="blended" />
          <feComposite in="blended" in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
    </svg>
  )
}
