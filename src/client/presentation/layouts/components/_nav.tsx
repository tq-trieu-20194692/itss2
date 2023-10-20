import React from 'react'
import CIcon from '@coreui/icons-react'
import {cilHistory, cilCalendar, cilUser} from '@coreui/icons'
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
        name: 'personalInfo',
        to: RouteConfig.ME,
        icon: <CIcon icon={cilUser} customClassName="nav-icon"/>,
    },
    {
        component: CNavItem,
        name:  'activityLog',
        icon: <CIcon icon={cilCalendar} customClassName="nav-icon"/>,
        to: RouteConfig.USER_ACTIVITY_LOG
    },
    {
        component: CNavItem,
        name: 'loginHistory',
        icon: <CIcon icon={cilHistory} customClassName="nav-icon"/>,
        to: RouteConfig.LOGIN_HISTORY
    }

]

export default _nav
