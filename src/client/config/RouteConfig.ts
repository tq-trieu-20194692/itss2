import React, {lazy} from "react";

type _T_Rcc = {
    path: string
    name?: string
    component?: React.FC<any>
    protect?: boolean
    replace?: boolean
    children?: _T_Rcc[]
}

export type T_Rco = _T_Rcc & {
    routes?: _T_Rcc[]
}
const HomePageScreen = lazy(() => import("../presentation/screens/homepage/HomePage"))
const DashboardScreen = lazy(() => import("../presentation/screens/dashboard/DashboardScreen"))
const UserLoginHistoryScreen = lazy(() => import("../presentation/screens/user/LoginHistory/UserLoginHistoryScreen"))
const ChangePasswordScreen = lazy(() => import("../presentation/screens/auth/changepassword/ChangePasswordScreen"))
const ChangePasswordOTPScreen = lazy(() => import("../presentation/screens/auth/changepassword/ChangePasswordOTPScreen"))
const RegisterScreen = lazy(() => import("../presentation/screens/auth/register/RegisterScreen"))
const MeScreen = lazy(() => import ("../presentation/screens/user/me/Me"))
export class RouteConfig {
    static readonly NOT_FOUND: string = "*"
    static readonly LOGIN: string = "/login"
    static readonly DASHBOARD: string = "/dashboard"
    static readonly HOME_PAGE: string = "/homepage"
    static readonly LOGIN_HISTORY: string = "/loginHistory"
    static readonly LOGIN_HISTORY_DETAIL: string = "/loginHistory/:id"
    static readonly USER_ACTIVITY_HISTORY: string = "/activityHistory"
    static readonly RESET_PASSWORD_OTP: string = "/change-password-otp"
    static readonly RESET_PASSWORD: string = "/reset-password/:token/:email" // Attention !!!!!!!!!!
    static readonly REGISTER: string = "/register"
    static readonly ME: string = "/me"


    static homePageRoute: T_Rco[] = [
        {
            name: 'Home Page',
            path: RouteConfig.HOME_PAGE,
            component: HomePageScreen,
            protect: true
        },
        {
            name: 'Lịch sử đăng nhập',
            path: RouteConfig.LOGIN_HISTORY,
            component: UserLoginHistoryScreen,
            protect: true
        },
    ]

    static changePasswordRoutes: T_Rco[] = [
        {
            name: 'Reset Password',
            path: RouteConfig.RESET_PASSWORD,
            component: ChangePasswordScreen,
            protect: true
        },
        {
            name: 'Reset Password OTP',
            path: RouteConfig.RESET_PASSWORD_OTP,
            component: ChangePasswordOTPScreen,
            protect: true
        },
        {
            name: 'register',
            path: RouteConfig.REGISTER,
            component: RegisterScreen,
            protect: false
        },
    ]

    static masterRoutes: T_Rco[] = [
        {
            name: 'dashboard',
            path: RouteConfig.DASHBOARD,
            component: DashboardScreen,
            protect: true
        },
        // {
        //     name: 'register',
        //     path: RouteConfig.REGISTER,
        //     component: RegisterScreen,
        //     protect: false
        // },
        {
            name: 'me',
            path: RouteConfig.ME,
            component: MeScreen,
            protect: true
        },

    ]
}
