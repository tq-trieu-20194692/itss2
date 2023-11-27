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
const DashboardScreen = lazy(() => import("../presentation/screens/dashboard/DashboardScreen"))
export class RouteConfig {
    static readonly NOT_FOUND: string = "*"
    static readonly LOGIN: string = "/login"
    static readonly DASHBOARD: string = "/dashboard"


    static masterRoutes: T_Rco[] = [
        {
            name: 'dashboard',
            path: RouteConfig.DASHBOARD,
            component: DashboardScreen,
            protect: true
        }
]
}
