import React from 'react'
import CIcon from '@coreui/icons-react'
import {cilSpeedometer} from '@coreui/icons'
import {CNavItem} from '@coreui/react'
import {RouteConfig} from "../../../config/RouteConfig";

type _T_NavChild = {
    component: any
    name: string
    to?: string
    badge?: {
        color: string
        text: string
    }
    href?: string
    items?: _T_NavChild[]
}

export type T_Nav = _T_NavChild & {
    icon?: any
}

const _nav: T_Nav[] = [
    {
        component: CNavItem,
        name: 'Dashboard',
        to: RouteConfig.DASHBOARD,
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon"/>,
        badge: {
            color: 'info',
            text: 'NEW',
        },
    },

]

export default _nav
