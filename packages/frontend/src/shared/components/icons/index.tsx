import {
  NewspaperIcon,
  UserCircleIcon,
  SettingsIcon,
  StarIcon,
  HomeIcon,
  TicketIcon,
  LogOutIcon,
  ChevronLeftIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  X,
  UploadCloud,
  FileIcon,
  CheckCircle,
  AlertCircle,
  UserRoundPlus,
  Trash2Icon,
  RefreshCcw,
  InfoIcon,
  PlusCircleIcon
} from 'lucide-react';

export const SharedIcons = {
  news: NewspaperIcon,
  events: TicketIcon,
  profile: UserCircleIcon,
  settings: SettingsIcon,
  resources: StarIcon,
  home: HomeIcon,
  chevronLeft: ChevronLeftIcon,
  arrowLeft: ArrowLeftIcon,
  arrowRight: ArrowRightIcon,
  uploadCloud: UploadCloud,
  x: X,
  fileIcon: FileIcon,
  checkCircle: CheckCircle,
  alertCircle: AlertCircle,
  userRoundPlus: UserRoundPlus,
  delete: Trash2Icon,
  refresh: RefreshCcw,
  info: InfoIcon,
  plusCircle: PlusCircleIcon,
  mentors: ({ ...props }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M17.0587 15.521C17.5265 15.2015 18.0752 15.0211 18.6413 15.0004C19.2074 14.9798 19.7678 15.1199 20.2576 15.4044C20.7474 15.689 21.1466 16.1064 21.4091 16.6084C21.6716 17.1104 21.7865 17.6764 21.7407 18.241C20.5409 18.6603 19.2665 18.8235 17.9997 18.72C17.9958 17.5866 17.6695 16.4768 17.0587 15.522C16.5166 14.6718 15.7689 13.972 14.8846 13.4875C14.0003 13.003 13.0081 12.7493 11.9997 12.75C10.9916 12.7495 9.99957 13.0032 9.11547 13.4877C8.23137 13.9723 7.48374 14.6719 6.94174 15.522M17.9987 18.719L17.9997 18.75C17.9997 18.975 17.9877 19.197 17.9627 19.416C16.1481 20.4571 14.0918 21.0033 11.9997 21C9.82974 21 7.79274 20.424 6.03674 19.416C6.01103 19.1846 5.99868 18.9519 5.99974 18.719M5.99974 18.719C4.73337 18.8263 3.45965 18.6637 2.26074 18.242C2.21509 17.6776 2.33014 17.1117 2.59257 16.6099C2.855 16.1081 3.25411 15.6908 3.74374 15.4063C4.23338 15.1218 4.79354 14.9817 5.35946 15.0021C5.92538 15.0226 6.47395 15.2028 6.94174 15.522M5.99974 18.719C6.00333 17.5857 6.33136 16.4769 6.94174 15.522M14.9997 6.75C14.9997 7.54565 14.6837 8.30871 14.1211 8.87132C13.5585 9.43393 12.7954 9.75 11.9997 9.75C11.2041 9.75 10.441 9.43393 9.87842 8.87132C9.31581 8.30871 8.99974 7.54565 8.99974 6.75C8.99974 5.95435 9.31581 5.19129 9.87842 4.62868C10.441 4.06607 11.2041 3.75 11.9997 3.75C12.7954 3.75 13.5585 4.06607 14.1211 4.62868C14.6837 5.19129 14.9997 5.95435 14.9997 6.75ZM20.9997 9.75C20.9997 10.0455 20.9415 10.3381 20.8285 10.611C20.7154 10.884 20.5497 11.1321 20.3407 11.341C20.1318 11.5499 19.8838 11.7157 19.6108 11.8287C19.3378 11.9418 19.0452 12 18.7497 12C18.4543 12 18.1617 11.9418 17.8887 11.8287C17.6157 11.7157 17.3677 11.5499 17.1588 11.341C16.9498 11.1321 16.7841 10.884 16.671 10.611C16.5579 10.3381 16.4997 10.0455 16.4997 9.75C16.4997 9.15326 16.7368 8.58097 17.1588 8.15901C17.5807 7.73705 18.153 7.5 18.7497 7.5C19.3465 7.5 19.9188 7.73705 20.3407 8.15901C20.7627 8.58097 20.9997 9.15326 20.9997 9.75ZM7.49974 9.75C7.49974 10.0455 7.44154 10.3381 7.32847 10.611C7.2154 10.884 7.04966 11.1321 6.84073 11.341C6.6318 11.5499 6.38376 11.7157 6.11078 11.8287C5.8378 11.9418 5.54522 12 5.24974 12C4.95427 12 4.66169 11.9418 4.3887 11.8287C4.11572 11.7157 3.86768 11.5499 3.65875 11.341C3.44982 11.1321 3.28409 10.884 3.17101 10.611C3.05794 10.3381 2.99974 10.0455 2.99974 9.75C2.99974 9.15326 3.23679 8.58097 3.65875 8.15901C4.08071 7.73705 4.653 7.5 5.24974 7.5C5.84648 7.5 6.41877 7.73705 6.84073 8.15901C7.26269 8.58097 7.49974 9.15326 7.49974 9.75Z"
        stroke="#F4F5F7"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      />
    </svg>
  ),
  support: ({ ...props }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M11.42 15.17L17.25 21C17.75 21.484 18.4202 21.7521 19.1161 21.7465C19.812 21.7408 20.4777 21.4619 20.9698 20.9698C21.4619 20.4777 21.7408 19.812 21.7465 19.1161C21.7521 18.4202 21.484 17.75 21 17.25L15.123 11.373M11.42 15.17L13.916 12.14C14.233 11.756 14.656 11.514 15.124 11.374C15.674 11.21 16.287 11.186 16.867 11.234C17.6488 11.3011 18.4346 11.1627 19.1464 10.8323C19.8582 10.502 20.4712 9.99124 20.9246 9.35081C21.3781 8.71037 21.6562 7.9625 21.7313 7.1814C21.8065 6.4003 21.676 5.61313 21.353 4.898L18.077 8.175C17.5289 8.04826 17.0274 7.77016 16.6296 7.37238C16.2318 6.97459 15.9537 6.4731 15.827 5.925L19.103 2.649C18.3879 2.32596 17.6007 2.19554 16.8196 2.27068C16.0385 2.34582 15.2906 2.62391 14.6502 3.07735C14.0098 3.53079 13.499 4.14381 13.1687 4.8556C12.8383 5.56738 12.6999 6.35317 12.767 7.135C12.858 8.211 12.696 9.399 11.863 10.085L11.761 10.17M11.42 15.17L6.765 20.823C6.53939 21.098 6.2587 21.3227 5.94099 21.4827C5.62329 21.6427 5.27561 21.7344 4.92033 21.7518C4.56505 21.7693 4.21005 21.7122 3.87817 21.5842C3.54629 21.4562 3.24489 21.2602 2.99336 21.0086C2.74184 20.7571 2.54577 20.4557 2.41776 20.1238C2.28976 19.792 2.23266 19.4369 2.25015 19.0817C2.26764 18.7264 2.35932 18.3787 2.51929 18.061C2.67927 17.7433 2.90399 17.4626 3.179 17.237L10.016 11.607L5.909 7.5H4.5L2.25 3.75L3.75 2.25L7.5 4.5V5.909L11.76 10.169L10.015 11.606M18.375 18.375L15.75 15.75M4.867 19.125H4.875V19.133H4.867V19.125Z"
        stroke="#F4F5F7"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      />
    </svg>
  ),
  logout: LogOutIcon,
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
  image: ({ ...props }) => (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g opacity="0.5">
        <path
          d="M15.2181 22.9806L15.2162 22.9784C14.6648 22.322 13.6494 22.336 13.1346 23.0315L8.99059 28.3572C8.99023 28.3577 8.98987 28.3581 8.98951 28.3586C8.30301 29.2321 8.91071 30.5167 10.0333 30.5167L30.0167 30.5167C31.1045 30.5167 31.7526 29.2681 31.0825 28.3822C31.0823 28.3819 31.0821 28.3817 31.0819 28.3814L25.2351 20.5857C25.2348 20.5853 25.2345 20.5849 25.2342 20.5845C24.7028 19.8687 23.64 19.8663 23.1047 20.5605C23.1044 20.5609 23.104 20.5614 23.1037 20.5618L18.3205 26.7183L15.2181 22.9806ZM34.5 8.33334L34.5 31.6667C34.5 33.2239 33.2239 34.5 31.6667 34.5L8.33333 34.5C6.77614 34.5 5.5 33.2239 5.5 31.6667L5.5 8.33333C5.5 6.77614 6.77614 5.5 8.33333 5.5L31.6667 5.5C33.2239 5.5 34.5 6.77615 34.5 8.33334Z"
          fill="#2D2D2D"
          stroke="#2D2D2D"
        />
      </g>
    </svg>
  )
};
