import React from 'react'
import {CImage, CSidebar, CSidebarBrand, CSidebarNav} from '@coreui/react'
import {AppSidebarNav} from './AppSidebarNav'
import SimpleBar from 'simplebar-react'
import {diary} from './_nav'
import {ThemeAction} from "../../../recoil/theme/ThemeAction";
const AppSidebarForDiary = () => {
    const {
        vm,
        dispatchSetState
    } = ThemeAction()

    return (
        <CSidebar
            position="fixed"
            unfoldable={vm.sidebarUnfoldable}
            visible={vm.sidebarShow}
            onVisibleChange={(visible) => {
                dispatchSetState({
                    sidebarShow: visible
                })
            }}
        >
            {/*@ts-ignore*/}
            <CSidebarBrand className="d-none d-md-flex" to="/homepage" style={{backgroundColor: "#001529"}}>
                <div style={{fontSize: '20px'}}>
                    <CImage rounded src="/logo.svg" width={32} height={32} style={{color: "white"}}/>
                    AUTOTIMELAPSE
                </div>
            </CSidebarBrand>
            <CSidebarNav>
                <SimpleBar>
                    <AppSidebarNav items={diary}/>
                </SimpleBar>
            </CSidebarNav>
        </CSidebar>

    )
}

export default React.memo(AppSidebarForDiary)
