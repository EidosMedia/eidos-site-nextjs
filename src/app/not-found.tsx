import Link from 'next/link';
import Navbar from './components/Navbar';
import { headers } from 'next/headers';
import SiteLogo from './components/Logo';
import Footer from './components/Footer';

export default async function NotFound() {
  const currentHeaders = await headers();
  const siteName = currentHeaders.get('x-neon-site-name') ?? '';

  return (
    <div className="w-full">
      <Navbar data={{ siteData: { siteName } }}></Navbar>
      <div className="max-w-page mx-auto px-space-md mt-space-4xl mb-space-6xl grid grid-cols-1 md:grid-cols-2 gap-space-2xs">
        <div className="col-span-1">
          <h1>We are sorry, but the page you are trying to visit no longer exists or is no longer available.</h1>
          <p>
            You can try to check if the url is correct, use the search bar to find out the content, or&nbsp;
            <Link href="/">go to the homepage</Link>.
          </p>
        </div>
        <div className="col-span-1 flex gap-space-2xs justify-center">
          <svg width="313" height="257" viewBox="0 0 313 257" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_d_439_14)">
              <path
                opacity="0.25"
                d="M24.66 20.29C24.66 21.71 23.5 22.86 22.09 22.86C20.68 22.86 19.52 21.7 19.52 20.29C19.52 18.88 20.68 17.72 22.09 17.72C23.5 17.72 24.66 18.88 24.66 20.29Z"
                fill="var(--color-canvas)"
              />
              <path
                opacity="0.25"
                d="M32.1301 22.86C33.5501 22.86 34.7001 21.71 34.7001 20.29C34.7001 18.87 33.5501 17.72 32.1301 17.72C30.7101 17.72 29.5601 18.88 29.5601 20.29C29.5601 21.7 30.7101 22.86 32.1301 22.86Z"
                fill="var(--color-canvas)"
              />
              <path
                opacity="0.25"
                d="M42.4401 22.86C43.8601 22.86 45.0101 21.71 45.0101 20.29C45.0101 18.87 43.8701 17.72 42.4401 17.72C41.0101 17.72 39.8701 18.88 39.8701 20.29C39.8701 21.7 41.0201 22.86 42.4401 22.86Z"
                fill="var(--color-canvas)"
              />
              <path
                d="M302.05 20.03V29.66L302.01 197.62C302.01 208.3 294.15 216.98 284.5 216.98H27.5198C17.8598 216.98 10.0098 208.3 10.0098 197.62V20.11C10.0098 14.55 14.5598 10.01 20.1098 10.01H291.96C297.49 10.01 302.01 14.51 302.06 20.03H302.05Z"
                fill="var(--color-canvas)"
              />
              <path
                opacity="0.4"
                d="M291.95 10H20.1C14.55 10 10 14.55 10 20.1V30.6L302.05 29.65V20.02C302 14.5 297.48 10 291.95 10ZM22.08 22.83C20.67 22.83 19.51 21.68 19.51 20.26C19.51 18.84 20.67 17.69 22.08 17.69C23.49 17.69 24.66 18.85 24.66 20.26C24.66 21.67 23.5 22.83 22.08 22.83ZM32.13 22.83C30.71 22.83 29.56 21.68 29.56 20.26C29.56 18.84 30.71 17.69 32.13 17.69C33.55 17.69 34.7 18.85 34.7 20.26C34.7 21.67 33.54 22.83 32.13 22.83ZM42.44 22.83C41.02 22.83 39.87 21.68 39.87 20.26C39.87 18.84 41.02 17.69 42.44 17.69C43.86 17.69 45.01 18.85 45.01 20.26C45.01 21.67 43.85 22.83 42.44 22.83Z"
                fill="url(#paint0_linear_439_14)"
              />
              <path
                opacity="0.25"
                d="M24.66 20.29C24.66 21.71 23.5 22.86 22.09 22.86C20.68 22.86 19.52 21.7 19.52 20.29C19.52 18.88 20.68 17.72 22.09 17.72C23.5 17.72 24.66 18.88 24.66 20.29Z"
                fill="url(#paint1_linear_439_14)"
              />
              <path
                opacity="0.25"
                d="M32.1301 22.86C33.5501 22.86 34.7001 21.71 34.7001 20.29C34.7001 18.87 33.5501 17.72 32.1301 17.72C30.7101 17.72 29.5601 18.88 29.5601 20.29C29.5601 21.7 30.7101 22.86 32.1301 22.86Z"
                fill="url(#paint2_linear_439_14)"
              />
              <path
                opacity="0.25"
                d="M42.4401 22.86C43.8601 22.86 45.0101 21.71 45.0101 20.29C45.0101 18.87 43.8701 17.72 42.4401 17.72C41.0101 17.72 39.8701 18.88 39.8701 20.29C39.8701 21.7 41.0201 22.86 42.4401 22.86Z"
                fill="url(#paint3_linear_439_14)"
              />
              <path
                d="M24.66 20.29C24.66 21.71 23.5 22.86 22.09 22.86C20.68 22.86 19.52 21.7 19.52 20.29C19.52 18.88 20.68 17.72 22.09 17.72C23.5 17.72 24.66 18.88 24.66 20.29Z"
                fill="var(--color-primary-lightest)"
              />
              <path
                d="M32.1301 22.86C33.5501 22.86 34.7001 21.71 34.7001 20.29C34.7001 18.87 33.5501 17.72 32.1301 17.72C30.7101 17.72 29.5601 18.88 29.5601 20.29C29.5601 21.7 30.7101 22.86 32.1301 22.86Z"
                fill="var(--color-primary-lightest)"
              />
              <path
                d="M42.4401 22.86C43.8601 22.86 45.0101 21.71 45.0101 20.29C45.0101 18.87 43.8701 17.72 42.4401 17.72C41.0101 17.72 39.8701 18.88 39.8701 20.29C39.8701 21.7 41.0201 22.86 42.4401 22.86Z"
                fill="var(--color-primary-lightest)"
              />
              <path
                opacity="0.25"
                d="M275.92 49.52H181.89C180.21 49.52 178.85 50.92 178.85 52.64V194.6C178.85 196.33 180.22 197.72 181.89 197.72H275.92C277.6 197.72 278.96 196.32 278.96 194.6V52.64C278.96 50.92 277.59 49.52 275.92 49.52Z"
                fill="var(--color-finance-mint)"
              />
              <path
                opacity="0.25"
                d="M96.0698 131.71H38.7998C35.4698 131.71 32.7598 134.42 32.7598 137.75V191.65C32.7598 195 35.4698 197.69 38.7998 197.69H96.0698C99.3998 197.69 102.11 194.98 102.11 191.65V137.75C102.11 134.4 99.3998 131.71 96.0698 131.71Z"
                fill="var(--color-primary-light)"
              />
              <path
                opacity="0.25"
                d="M163.51 131.6H112.21C110.67 131.6 109.42 133.16 109.42 135.09V156.54C109.42 158.47 110.67 160.03 112.21 160.03H163.51C165.05 160.03 166.3 158.47 166.3 156.54V135.09C166.3 133.16 165.05 131.6 163.51 131.6Z"
                fill="var(--color-primary-light)"
              />
              <path
                opacity="0.25"
                d="M163.51 169.11H112.21C110.67 169.11 109.42 170.68 109.42 172.63V194.19C109.42 196.14 110.67 197.71 112.21 197.71H163.51C165.05 197.71 166.3 196.14 166.3 194.19V172.63C166.3 170.68 165.05 169.11 163.51 169.11Z"
                fill="var(--color-primary-light)"
              />
              <path
                opacity="0.25"
                d="M32.7598 51.68V118.49C32.7598 119.68 34.0198 120.66 35.5798 120.66H164.03C165.59 120.66 166.85 119.69 166.85 118.49V51.68C166.85 50.49 165.59 49.52 164.03 49.52H35.5798C34.0198 49.52 32.7598 50.49 32.7598 51.68Z"
                fill="var(--color-media-red)"
              />
            </g>
            <g filter="url(#filter1_d_439_14)">
              <path
                d="M256.87 221.74L220.46 179.88C219.64 178.89 218.7 178.05 217.7 177.33C244.23 146.04 245.26 99.3001 218.07 66.7301C201.07 46.3701 176.65 35.8701 152.05 35.8601C132.62 35.8601 113.08 42.4101 96.9998 55.8401C60.5598 86.2701 55.6898 140.47 86.1098 176.91C113.3 209.48 159.48 216.81 195 196.28C195.53 197.39 196.19 198.46 197.02 199.45L233.43 241.31C238.81 247.76 248.49 248.63 254.94 243.24C261.39 237.86 262.26 228.18 256.87 221.73V221.74ZM131.97 185.05C96.7998 173.99 77.2498 136.52 88.3098 101.34C99.3698 66.1701 136.84 46.6201 172.01 57.6801C207.18 68.7401 226.73 106.21 215.67 141.38C204.61 176.55 167.14 196.1 131.96 185.04L131.97 185.05Z"
                fill="url(#paint4_linear_439_14)"
              />
            </g>
            <path
              opacity="0.6"
              d="M215.67 141.39C204.61 176.56 167.14 196.11 131.96 185.05C96.79 173.99 77.24 136.52 88.3 101.34C99.36 66.1701 136.83 46.6201 172 57.6801C207.17 68.7401 226.72 106.21 215.66 141.38"
              fill="url(#paint5_linear_439_14)"
            />
            <g filter="url(#filter2_d_439_14)">
              <path
                d="M159.28 155.7V157.35C159.28 161.09 156.23 164.13 152.5 164.13H150.85C147.11 164.13 144.07 161.09 144.07 157.35V155.7C144.07 151.96 147.11 148.92 150.85 148.92H152.5C156.23 148.92 159.28 151.96 159.28 155.7Z"
                fill="var(--color-canvas)"
              />
              <path
                d="M179.5 102.42C179.5 105.84 178.73 109.2 177.21 112.41C175.67 115.64 172.25 119.57 166.75 124.43C162.02 128.64 160.27 131.02 159.63 132.27C159.22 133.1 158.66 134.81 158.35 138.25C158.03 141.78 155.12 144.45 151.59 144.45C149.75 144.45 147.96 143.68 146.69 142.35C145.4 141.01 144.74 139.25 144.82 137.41C144.9 135.52 145.03 134.04 145.21 132.86C145.55 130.71 146.26 128.59 147.33 126.54C148.37 124.53 149.75 122.61 151.42 120.84C153.01 119.16 155.25 117.06 158.1 114.58C162.27 110.88 163.78 108.82 164.31 107.74C165.06 106.22 165.45 104.67 165.45 103.13C165.45 99.8501 164.16 97.0201 161.52 94.4901C158.86 91.9401 155.7 90.7001 151.86 90.7001C145.09 90.7001 140.77 94.2801 138.67 101.63C137.78 104.76 134.73 106.77 131.45 106.41L130.72 106.33C128.73 106.12 126.94 105.04 125.81 103.38C124.7 101.74 124.37 99.7001 124.9 97.8001C126.34 92.6201 128.94 88.3701 132.61 85.1501C137.56 80.8101 144 78.6101 151.75 78.6101C159.5 78.6101 166.38 80.8601 171.56 85.2901C176.83 89.8101 179.5 95.5701 179.5 102.42Z"
                fill="var(--color-canvas)"
              />
            </g>
            <defs>
              <filter
                id="filter0_d_439_14"
                x="0"
                y="0"
                width="312.06"
                height="226.98"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset />
                <feGaussianBlur stdDeviation="5" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_439_14" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_439_14" result="shape" />
              </filter>
              <filter
                id="filter1_d_439_14"
                x="56.1348"
                y="25.8601"
                width="214.272"
                height="230.917"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset />
                <feGaussianBlur stdDeviation="5" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_439_14" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_439_14" result="shape" />
              </filter>
              <filter
                id="filter2_d_439_14"
                x="114.652"
                y="68.6101"
                width="74.8472"
                height="105.52"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset />
                <feGaussianBlur stdDeviation="5" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_439_14" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_439_14" result="shape" />
              </filter>
              <linearGradient
                id="paint0_linear_439_14"
                x1="10"
                y1="20.31"
                x2="302.05"
                y2="20.31"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="var(--color-blue)" />
                <stop offset="0.49" stopColor="var(--color-finance-purple-light)" />
                <stop offset="0.61" stopColor="var(--color-media-violet)" />
                <stop offset="0.88" stopColor="var(--color-media-plum)" />
                <stop offset="1" stopColor="var(--color-media-red)" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_439_14"
                x1="19.55"
                y1="20.3"
                x2="24.66"
                y2="20.3"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="var(--color-blue)" />
                <stop offset="0.49" stopColor="var(--color-finance-purple-light)" />
                <stop offset="0.61" stopColor="var(--color-media-violet)" />
                <stop offset="0.88" stopColor="var(--color-media-plum)" />
                <stop offset="1" stopColor="var(--color-media-red)" />
              </linearGradient>
              <linearGradient
                id="paint2_linear_439_14"
                x1="29.5901"
                y1="20.3"
                x2="34.7001"
                y2="20.3"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="var(--color-blue)" />
                <stop offset="0.49" stopColor="var(--color-finance-purple-light)" />
                <stop offset="0.61" stopColor="var(--color-media-violet)" />
                <stop offset="0.88" stopColor="var(--color-media-plum)" />
                <stop offset="1" stopColor="var(--color-media-red)" />
              </linearGradient>
              <linearGradient
                id="paint3_linear_439_14"
                x1="39.8701"
                y1="20.3"
                x2="44.9801"
                y2="20.3"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="var(--color-blue)" />
                <stop offset="0.49" stopColor="var(--color-finance-purple-light)" />
                <stop offset="0.61" stopColor="var(--color-media-violet)" />
                <stop offset="0.88" stopColor="var(--color-media-plum)" />
                <stop offset="1" stopColor="var(--color-media-red)" />
              </linearGradient>
              <linearGradient
                id="paint4_linear_439_14"
                x1="77.6198"
                y1="71.9601"
                x2="282.61"
                y2="190.31"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="var(--color-blue)" />
                <stop offset="0.49" stopColor="var(--color-finance-purple-light)" />
                <stop offset="0.61" stopColor="var(--color-media-violet)" />
                <stop offset="0.88" stopColor="var(--color-media-plum)" />
                <stop offset="1" stopColor="var(--color-media-red)" />
              </linearGradient>
              <linearGradient
                id="paint5_linear_439_14"
                x1="94.16"
                y1="87.9801"
                x2="209.81"
                y2="154.75"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="var(--color-blue)" />
                <stop offset="0.49" stopColor="var(--color-finance-purple-light)" />
                <stop offset="0.61" stopColor="var(--color-media-violet)" />
                <stop offset="0.88" stopColor="var(--color-media-plum)" />
                <stop offset="1" stopColor="var(--color-media-red)" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <Footer data={{ siteData: { siteName } }} />
    </div>
  );
}
