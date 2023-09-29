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
const UserLoginHistoryScreen  = lazy(() => import("../presentation/screens/user/LoginHistory/UserLoginHistoryScreen"))
export class RouteConfig {
    static readonly NOT_FOUND: string = "*"
    static readonly LOGIN: string = "/login"
    static readonly DASHBOARD: string = "/dashboard"
    static readonly HOME_PAGE: string = "/homepage"
    static readonly LOGIN_HISTORY : string = "/loginHistory"
    static readonly LOGIN_HISTORY_DETAIL : string = "/loginHistory/:id"
    static readonly USER_ACTIVITY_HISTORY: string = "/activityHistory"

    static homePageRoute : T_Rco[] = [
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
    static masterRoutes: T_Rco[] = [
        {
            name: 'dashboard',
            path: RouteConfig.DASHBOARD,
            component: DashboardScreen,
            protect: true
        },

    ]
}
