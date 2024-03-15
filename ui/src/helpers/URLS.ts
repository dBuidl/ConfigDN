const URLS: { [key: string]: string } = {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    HOME: "/",
    DASHBOARD: "/dashboard",
    LOGOUT: "/auth/logout",
    OAUTH2_REDIRECT: "/auth/oauth",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password/:token",
    CHANGE_PASSWORD: "/auth/change-password",
}

export default URLS;