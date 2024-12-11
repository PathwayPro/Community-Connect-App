import Cookies from 'js-cookie';

interface TokenData {
  accessToken: string;
  refreshToken: string;
}

const ACCESS_TOKEN_KEY = 'cc_access_token';
const REFRESH_TOKEN_KEY = 'cc_refresh_token';

const cookieOptions = {
  secure: true,
  sameSite: 'strict' as const
};

export const tokens = {
  set: ({ accessToken, refreshToken }: TokenData) => {
    Cookies.set(ACCESS_TOKEN_KEY, accessToken, cookieOptions);
    Cookies.set(REFRESH_TOKEN_KEY, refreshToken, cookieOptions);
  },

  get: (): TokenData | null => {
    const accessToken = Cookies.get(ACCESS_TOKEN_KEY);
    const refreshToken = Cookies.get(REFRESH_TOKEN_KEY);

    if (!accessToken || !refreshToken) return null;

    return { accessToken, refreshToken };
  },

  clear: () => {
    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
  },

  getAccessToken: () => Cookies.get(ACCESS_TOKEN_KEY),
  getRefreshToken: () => Cookies.get(REFRESH_TOKEN_KEY)
};
