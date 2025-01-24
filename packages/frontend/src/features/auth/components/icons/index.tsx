import {
  AlertTriangle,
  Loader2,
  XCircle,
  SearchIcon,
  User,
  MapPin,
  Clock
} from 'lucide-react';

export const Icons = {
  clock: Clock,
  map: MapPin,
  spinner: Loader2,
  xCircle: XCircle,
  alertTriangle: AlertTriangle,
  google: ({ ...props }) => (
    <svg
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23.76 12.7727C23.76 11.9218 23.6836 11.1036 23.5418 10.3182H12.24V14.96H18.6982C18.42 16.46 17.5745 17.7309 16.3036 18.5818V21.5927H20.1818C22.4509 19.5036 23.76 16.4273 23.76 12.7727Z"
        fill="#4285F4"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.24 24.5C15.48 24.5 18.1964 23.4255 20.1818 21.5928L16.3036 18.5818C15.2291 19.3018 13.8545 19.7273 12.24 19.7273C9.11454 19.7273 6.46909 17.6164 5.52545 14.78H1.51636V17.8891C3.4909 21.8109 7.54909 24.5 12.24 24.5Z"
        fill="#34A853"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.52545 14.78C5.28545 14.06 5.14908 13.2909 5.14908 12.5C5.14908 11.7091 5.28545 10.94 5.52545 10.22V7.1109H1.51635C0.703627 8.7309 0.23999 10.5636 0.23999 12.5C0.23999 14.4364 0.703627 16.2691 1.51635 17.8891L5.52545 14.78Z"
        fill="#FBBC05"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.24 5.27273C14.0018 5.27273 15.5836 5.87818 16.8273 7.06728L20.2691 3.62546C18.1909 1.68909 15.4745 0.5 12.24 0.5C7.54909 0.5 3.4909 3.18909 1.51636 7.11091L5.52545 10.22C6.46909 7.38364 9.11454 5.27273 12.24 5.27273Z"
        fill="#EA4335"
      />
    </svg>
  ),
  user: User,
  lock: ({ ...props }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M16.5 11V7.25C16.5 4.76472 14.4853 2.75 12 2.75C9.51472 2.75 7.5 4.76472 7.5 7.25V11M6.75 22.25H17.25C18.4926 22.25 19.5 21.2426 19.5 20V13.25C19.5 12.0074 18.4926 11 17.25 11H6.75C5.50736 11 4.5 12.0074 4.5 13.25V20C4.5 21.2426 5.50736 22.25 6.75 22.25Z"
        stroke="#5A5A5A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  mail: ({ ...props }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M21.75 7.25V17.75C21.75 18.3467 21.5129 18.919 21.091 19.341C20.669 19.7629 20.0967 20 19.5 20H4.5C3.90326 20 3.33097 19.7629 2.90901 19.341C2.48705 18.919 2.25 18.3467 2.25 17.75V7.25M21.75 7.25C21.75 6.65326 21.5129 6.08097 21.091 5.65901C20.669 5.23705 20.0967 5 19.5 5H4.5C3.90326 5 3.33097 5.23705 2.90901 5.65901C2.48705 6.08097 2.25 6.65326 2.25 7.25M21.75 7.25V7.493C21.75 7.87715 21.6517 8.25491 21.4644 8.5903C21.2771 8.92569 21.0071 9.20754 20.68 9.409L13.18 14.024C12.8252 14.2425 12.4167 14.3582 12 14.3582C11.5833 14.3582 11.1748 14.2425 10.82 14.024L3.32 9.41C2.99292 9.20854 2.72287 8.92669 2.53557 8.5913C2.34827 8.25591 2.24996 7.87815 2.25 7.494V7.25"
        stroke="#787878"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  logo: ({ ...props }) => (
    <svg
      viewBox="0 0 84 84"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_43_2250)">
        <path
          d="M84 42.5C84 19.304 65.196 0.5 42 0.5C18.804 0.5 0 19.304 0 42.5C0 65.696 18.804 84.5 42 84.5C65.196 84.5 84 65.696 84 42.5Z"
          fill="white"
        />
        <g filter="url(#filter0_d_43_2250)">
          <path
            d="M63.3458 63.7037C64.1268 64.4847 64.1307 65.7562 63.3031 66.4878C59.0031 70.2889 53.7634 72.8925 48.1112 74.0168C41.8037 75.2715 35.2658 74.6276 29.3242 72.1665C23.3827 69.7054 18.3043 65.5377 14.7314 60.1905C11.1585 54.8432 9.25147 48.5566 9.25146 42.1255C9.25146 35.6944 11.1585 29.4078 14.7314 24.0605C18.3043 18.7133 23.3827 14.5456 29.3242 12.0845C35.2658 9.62347 41.8037 8.97954 48.1112 10.2342C53.7634 11.3585 59.0031 13.9621 63.3031 17.7632C64.1307 18.4948 64.1268 19.7663 63.3458 20.5473L56.0575 27.8356C55.2765 28.6166 54.0163 28.6067 53.1543 27.916C50.8812 26.0944 48.196 24.8384 45.32 24.2664C41.7878 23.5638 38.1266 23.9244 34.7993 25.3026C31.472 26.6808 28.6282 29.0146 26.6273 32.0091C24.6265 35.0036 23.5586 38.5241 23.5586 42.1255C23.5586 45.7269 24.6265 49.2474 26.6273 52.2419C28.6282 55.2364 31.472 57.5703 34.7993 58.9485C38.1266 60.3267 41.7878 60.6873 45.32 59.9847C48.196 59.4126 50.8813 58.1566 53.1543 56.335C54.0163 55.6443 55.2765 55.6344 56.0575 56.4154L63.3458 63.7037Z"
            fill="#374983"
          />
        </g>
        <g filter="url(#filter1_d_43_2250)">
          <path
            d="M64.0648 40.732C67.6564 40.732 70.568 37.8205 70.568 34.2288C70.568 30.6372 67.6564 27.7256 64.0648 27.7256C60.4731 27.7256 57.5615 30.6372 57.5615 34.2288C57.5615 37.8205 60.4731 40.732 64.0648 40.732Z"
            fill="#FCBC5C"
          />
        </g>
        <g filter="url(#filter2_d_43_2250)">
          <path
            d="M64.0648 56.5261C67.6564 56.5261 70.568 53.6145 70.568 50.0228C70.568 46.4312 67.6564 43.5196 64.0648 43.5196C60.4731 43.5196 57.5615 46.4312 57.5615 50.0228C57.5615 53.6145 60.4731 56.5261 64.0648 56.5261Z"
            fill="#FCBC5C"
          />
        </g>
        <g filter="url(#filter3_d_43_2250)">
          <path
            d="M9.66042 56.5702C9.28964 56.7315 9.11915 57.1632 9.28798 57.5307C11.3935 62.1131 14.4396 66.2047 18.2313 69.5379C22.0229 72.8711 26.4711 75.3677 31.2856 76.8686C31.6716 76.989 32.078 76.7645 32.1904 76.3762C32.3029 75.9878 32.0789 75.5825 31.693 75.4618C27.0852 74.021 22.828 71.6292 19.198 68.4381C15.5681 65.247 12.6504 61.3314 10.6309 56.9464C10.4618 56.5791 10.0312 56.4089 9.66042 56.5702Z"
            fill="#E3A953"
          />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_d_43_2250"
          x="9.25146"
          y="9.60938"
          width="58.6763"
          height="69.0323"
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
          <feOffset dx="2" dy="2" />
          <feGaussianBlur stdDeviation="1" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_43_2250"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_43_2250"
            result="shape"
          />
        </filter>
        <filter
          id="filter1_d_43_2250"
          x="57.5615"
          y="27.7256"
          width="17.0065"
          height="17.0065"
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
          <feOffset dx="2" dy="2" />
          <feGaussianBlur stdDeviation="1" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_43_2250"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_43_2250"
            result="shape"
          />
        </filter>
        <filter
          id="filter2_d_43_2250"
          x="57.5615"
          y="43.5196"
          width="17.0065"
          height="17.0065"
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
          <feOffset dx="2" dy="2" />
          <feGaussianBlur stdDeviation="1" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_43_2250"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_43_2250"
            result="shape"
          />
        </filter>
        <filter
          id="filter3_d_43_2250"
          x="9.22266"
          y="56.5092"
          width="26.9968"
          height="24.3919"
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
          <feOffset dx="2" dy="2" />
          <feGaussianBlur stdDeviation="1" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_43_2250"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_43_2250"
            result="shape"
          />
        </filter>
        <clipPath id="clip0_43_2250">
          <rect
            width="84"
            height="84"
            fill="white"
            transform="translate(0 0.5)"
          />
        </clipPath>
      </defs>
    </svg>
  ),
  circleHelp: ({ ...props }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9.87891 8.01884C11.0505 6.99372 12.95 6.99372 14.1215 8.01884C15.2931 9.04397 15.2931 10.706 14.1215 11.7312C13.9176 11.9096 13.6917 12.0569 13.4513 12.1733C12.7056 12.5341 12.0002 13.1716 12.0002 14V14.75M21 12.5C21 17.4706 16.9706 21.5 12 21.5C7.02944 21.5 3 17.4706 3 12.5C3 7.52944 7.02944 3.5 12 3.5C16.9706 3.5 21 7.52944 21 12.5ZM12 17.75H12.0075V17.7575H12V17.75Z"
        stroke="#97A0AF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  eye: ({ ...props }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M2.0355 12.8224C1.96642 12.6151 1.96635 12.3907 2.03531 12.1834C3.42368 8.00972 7.36074 5 12.0008 5C16.6386 5 20.5742 8.00692 21.9643 12.1776C22.0334 12.3849 22.0334 12.6093 21.9645 12.8166C20.5761 16.9903 16.639 20 11.999 20C7.36115 20 3.42559 16.9931 2.0355 12.8224Z"
        stroke="#B3BAC5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 12.5C15 14.1569 13.6568 15.5 12 15.5C10.3431 15.5 8.99995 14.1569 8.99995 12.5C8.99995 10.8431 10.3431 9.5 12 9.5C13.6568 9.5 15 10.8431 15 12.5Z"
        stroke="#B3BAC5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  eyeSlash: ({ ...props }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3.97996 8.723C3.04442 9.82718 2.34778 11.1132 1.93396 12.5C3.22596 16.838 7.24396 20 12 20C12.993 20 13.953 19.862 14.863 19.605M6.22796 6.728C7.94058 5.59781 9.94804 4.99682 12 5C16.756 5 20.773 8.162 22.065 12.498C21.3568 14.8673 19.8369 16.9115 17.772 18.272M6.22796 6.728L2.99996 3.5M6.22796 6.728L9.87796 10.378M17.772 18.272L21 21.5M17.772 18.272L14.122 14.622C14.4006 14.3434 14.6216 14.0127 14.7723 13.6486C14.9231 13.2846 15.0007 12.8945 15.0007 12.5005C15.0007 12.1065 14.9231 11.7164 14.7723 11.3524C14.6216 10.9883 14.4006 10.6576 14.122 10.379C13.8434 10.1004 13.5126 9.8794 13.1486 9.72863C12.7846 9.57785 12.3945 9.50025 12.0005 9.50025C11.6065 9.50025 11.2163 9.57785 10.8523 9.72863C10.4883 9.8794 10.1576 10.1004 9.87896 10.379M14.121 14.621L9.87996 10.38"
        stroke="#B3BAC5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  informationCircle: ({ ...props }) => (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7.5 8L7.52766 7.98617C7.90974 7.79513 8.33994 8.14023 8.23634 8.55465L7.76366 10.4453C7.66006 10.8598 8.09026 11.2049 8.47234 11.0138L8.5 11M14 8.5C14 11.8137 11.3137 14.5 8 14.5C4.68629 14.5 2 11.8137 2 8.5C2 5.18629 4.68629 2.5 8 2.5C11.3137 2.5 14 5.18629 14 8.5ZM8 6H8.005V6.005H8V6Z"
        stroke="#F43F5E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  checkCircle: ({ ...props }) => (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 32C6 17.64 17.64 6 32 6C46.36 6 58 17.64 58 32C58 46.36 46.36 58 32 58C17.64 58 6 46.36 6 32ZM41.6267 27.1627C41.7867 26.9495 41.9024 26.7064 41.9672 26.4479C42.0319 26.1893 42.0443 25.9204 42.0036 25.6569C41.9629 25.3935 41.87 25.1409 41.7303 24.9139C41.5906 24.6869 41.4069 24.4901 41.19 24.3351C40.9732 24.1801 40.7275 24.07 40.4675 24.0113C40.2075 23.9526 39.9384 23.9464 39.6759 23.9932C39.4135 24.04 39.1631 24.1388 38.9394 24.2838C38.7157 24.4287 38.5233 24.6169 38.3733 24.8373L29.744 36.9173L25.4133 32.5867C25.0342 32.2334 24.5327 32.0411 24.0146 32.0502C23.4965 32.0593 23.0021 32.2692 22.6357 32.6357C22.2692 33.0021 22.0593 33.4965 22.0502 34.0146C22.0411 34.5327 22.2334 35.0342 22.5867 35.4133L28.5867 41.4133C28.792 41.6185 29.0395 41.7765 29.312 41.8764C29.5845 41.9763 29.8754 42.0157 30.1647 41.9918C30.454 41.968 30.7346 41.8815 30.987 41.7383C31.2395 41.5951 31.4577 41.3987 31.6267 41.1627L41.6267 27.1627Z"
        fill="#22C55E"
      />
    </svg>
  ),
  search: SearchIcon
};
