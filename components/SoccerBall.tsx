// Soccer ball artwork by nicubunu (Openclipart), released into the Public Domain.
// Source: http://openclipart.org/detail/21992/soccer-ball-by-nicubunu
// Inlined so it can be spun and themed; the original's cast-shadow path is dropped
// so the shadow doesn't rotate with the ball during the kick animation.

const BALL_INNER = `
  <defs>
    <linearGradient id="wcpBallShine">
      <stop stop-color="#fff" stop-opacity="0" offset="0"/>
      <stop stop-color="#fff" stop-opacity=".4" offset="1"/>
    </linearGradient>
    <linearGradient id="wcpBallShine1" x1="41.994" xlink:href="#wcpBallShine" gradientUnits="userSpaceOnUse" y1="27.905" gradientTransform="matrix(1.9528 0 0 .51208 13.174 17.367)" x2="42.135" y2="20.11"/>
    <linearGradient id="wcpBallShine2" x1="22.281" xlink:href="#wcpBallShine" gradientUnits="userSpaceOnUse" y1="43.953" gradientTransform="matrix(.71392 0 0 1.4007 13.174 17.367)" x2="19.597" y2="35.13"/>
    <linearGradient id="wcpBallShine3" x1="50.314" xlink:href="#wcpBallShine" gradientUnits="userSpaceOnUse" y1="103.02" gradientTransform="matrix(1.5106 0 0 .662 13.174 17.367)" x2="45.156" y2="114.01"/>
    <linearGradient id="wcpBallShine4" x1="65.632" xlink:href="#wcpBallShine" gradientUnits="userSpaceOnUse" y1="54.745" gradientTransform="matrix(1.1612 0 0 .86115 13.174 17.367)" x2="66.265" y2="39.219"/>
  </defs>
  <path stroke-linejoin="round" d="m155.07 86.316a66.768 65.691 0 1 1 -133.53 0 66.768 65.691 0 1 1 133.53 0z" fill-rule="evenodd" transform="matrix(1.1065 0 0 1.1191 .17718 5.6525)" stroke="#10192c" stroke-width="2.2466" fill="#eef3fb"/>
  <path stroke-linejoin="round" stroke-width="2.5" fill-rule="evenodd" fill="#10192c" d="m63.191 63.552l28.238-16.8 26.041 16.417-12.07 30.727-32.206-1.053-10.003-29.291z"/>
  <path stroke-linejoin="round" stroke-width="2.5" fill-rule="evenodd" fill="#10192c" d="m121.92 118.55l27.18-0.39 2.87 24.27-28.27 20.63-18.87-16.66 17.09-27.85z"/>
  <path stroke-linejoin="round" stroke-width="2.5" fill-rule="evenodd" fill="#10192c" d="m35.143 116.06l23.261 1.77 16.465 28.86-12.492 14.69-22.974-18.81-4.26-26.51z"/>
  <path stroke-linejoin="round" stroke-width="2.5" fill-rule="evenodd" fill="#10192c" d="m28.251 90.402l14.214-25.415 0.862-11.2c-2.538 0-18.741 26.109-18.618 37.524 2.154 4.307 3.542-0.909 3.542-0.909z"/>
  <path stroke-linejoin="round" stroke-width="2.5" fill-rule="evenodd" fill="#10192c" d="m142.81 46.101v17.747l16.9 28.083 10.84-1.005c0.51-12.691-13.2-35.536-17.26-37.566-3.56-2.01-10.48-7.259-10.48-7.259z"/>
  <path stroke-linejoin="round" d="m41.095 64.528l23.906-0.507" stroke="#10192c" stroke-width="2.5" fill="none"/>
  <path stroke-linejoin="round" stroke-width="2.5" fill-rule="evenodd" fill="#10192c" d="m83.079 30.007l10.65 3.371 16.411-3.371s-23-3.046-27.061 0z"/>
  <path stroke-linejoin="round" d="m93.892 33.053l-2.031 14.722" stroke="#10192c" stroke-width="2.5" fill="none"/>
  <path stroke-linejoin="round" d="m26.681 91.588l9.891 26.292" stroke="#10192c" stroke-width="2.5" fill="none"/>
  <path stroke-linejoin="round" d="m58.31 119.6l16.336-28.565" stroke="#10192c" stroke-width="2.5" fill="none"/>
  <path stroke-linejoin="round" d="m115.72 64.021l28.52-0.708" stroke="#10192c" stroke-width="2.5" fill="none"/>
  <path stroke-linejoin="round" d="m104.15 91.851l18.57 28.769" stroke="#10192c" stroke-width="2.5" fill="none"/>
  <path stroke-linejoin="round" d="m160.59 91.035l-12.78 29.775" stroke="#10192c" stroke-width="2.5" fill="none"/>
  <path stroke-linejoin="round" d="m72.833 146.26l34.147-0.2" stroke="#10192c" stroke-width="2.5" fill="none"/>
  <path stroke-linejoin="round" d="m61.864 158.86l16.997 14.35" stroke="#10192c" stroke-width="2.5" fill="none"/>
  <path stroke-linejoin="round" d="m124.82 160.12l-14.68 14.57" stroke="#10192c" stroke-width="2.5" fill="none"/>
  <path stroke-linejoin="round" d="m150 141.85l7.86 1.87" stroke="#10192c" stroke-width="2.5" fill="none"/>
  <path stroke-linejoin="round" d="m37.289 143.11l3.405-1.1" stroke="#10192c" stroke-width="2.5" fill="none"/>
  <path stroke="#10192c" stroke-width="1pt" fill="none" d="m144.19 48.062l-13.79-11.462"/>
  <path stroke-width="1pt" fill-rule="evenodd" fill="url(#wcpBallShine4)" d="m91.548 47.653l-16.567 9.713c-13.041 18.396 33.369 21.773 31.049 0-2.01-2.345-14.482-9.713-14.482-9.713z"/>
  <path stroke-width="1pt" fill-rule="evenodd" fill="url(#wcpBallShine3)" d="m74.131 91.864c9.713 0.669 21.101 1.004 23.11 0.669 10.049-4.689-25.119-21.435-23.11-0.669z"/>
  <path stroke-width="1pt" fill-rule="evenodd" fill="url(#wcpBallShine2)" d="m39.968 57.366c-5.719 0.798-16.489 28.159-15.071 30.813 2.009 2.68 19.091-21.77 15.071-30.813z"/>
  <path stroke-width="1pt" fill-rule="evenodd" fill="url(#wcpBallShine1)" d="m86.189 28.897s18.421-2.01 19.091 0c-8.039 3.684-11.388 7.033-19.091 0z"/>
`;

export function SoccerBall({ size = 72 }: { size?: number }) {
  return (
    <svg
      viewBox="20 24 156 156"
      width={size}
      height={size}
      style={{ filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.45))" }}
      aria-hidden
      dangerouslySetInnerHTML={{ __html: BALL_INNER }}
    />
  );
}
