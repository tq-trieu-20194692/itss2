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
const UserActivityLogScreen = lazy(() => import("../presentation/screens/user/ActivityLog/UserActivityLogScreen"))
const ChangePasswordScreen = lazy(() => import("../presentation/screens/auth/changepassword/ChangePasswordScreen"))
const ChangePasswordOTPScreen = lazy(() => import("../presentation/screens/auth/changepassword/ChangePasswordOTPScreen"))
const RegisterScreen = lazy(() => import("../presentation/screens/auth/register/RegisterScreen"))
const MeScreen = lazy(() => import ("../presentation/screens/user/me/Me"))
const DiaryScreen = lazy(() => import("../presentation/screens/diary/OneDiaryScreen"))
const DiaryScheduleScreen = lazy(() => import("../presentation/screens/diary/DiaryScheduleScreen"))
export class RouteConfig {
    static readonly NOT_FOUND: string = "*"
    static readonly LOGIN: string = "/login"
    static readonly DASHBOARD: string = "/dashboard"
    static readonly HOME_PAGE: string = "/"
    static readonly LOGIN_HISTORY: string = "/loginHistory"
    static readonly RESET_PASSWORD_OTP: string = "/change-password-otp"
    static readonly RESET_PASSWORD: string = "/reset-password/:token/:email/:time" // Attention !!!!!!!!!!
    static readonly ONE_DIARY: string = "/diary"
    static readonly REGISTER: string = "/register"
    static readonly ME: string = "/me"
    static readonly USER_ACTIVITY_LOG: string = "/activityLog"
    static readonly TEST:string = "/test"
    static readonly ONE_DIARY_SCHEDULE:string = "/schedule"
    static readonly ONE_DIARY_EXPORT:string = "/exportData"

    static homePageRoute: T_Rco[] = [
        {
            name: 'Home Page',
            path: RouteConfig.HOME_PAGE,
            component: HomePageScreen,
            protect: true
        },
    ]
    static DiaryRoute: T_Rco[] = [
        {
            name: 'diary',
            path: RouteConfig.ONE_DIARY,
            component: DiaryScreen,
            protect: true
        },
        {
            name: 'oneDiary',
            path: RouteConfig.ONE_DIARY_SCHEDULE,
            component: DiaryScheduleScreen,
            protect: true
        },
        {
            name: 'diaryExportData',
            path: RouteConfig.ONE_DIARY_EXPORT,
            component: DiaryScheduleScreen,
            protect: true
        },

    ]
    static changePasswordRoutes: T_Rco[] = [
        {
            name: 'Reset Password',
            path: RouteConfig.RESET_PASSWORD,
            component: ChangePasswordScreen,
            protect: false
        },
        {
            name: 'Reset Password OTP',
            path: RouteConfig.RESET_PASSWORD_OTP,
            component: ChangePasswordOTPScreen,
            protect: false
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

        {
            name: 'personalInfo',
            path: RouteConfig.ME,
            component: MeScreen,
            protect: true
        },
        {
            name: 'loginHistory',
            path: RouteConfig.LOGIN_HISTORY,
            component: UserLoginHistoryScreen,
            protect: true
        },
        {
            name:'activityLog',
            path: RouteConfig.USER_ACTIVITY_LOG,
            component: UserActivityLogScreen,
            protect: true
        },

    ]
}
