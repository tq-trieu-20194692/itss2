import React, {ReactNode, useEffect, useState} from 'react'
import {CContainer, CHeader, CHeaderBrand, CHeaderDivider, CHeaderNav, CHeaderToggler, CNavItem, CNavLink} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {cilMenu} from '@coreui/icons'
import {logoHeader} from '../../../assets/brand/brand'
import {ThemeAction} from "../../../recoil/theme/ThemeAction";
import AppBreadcrumb from "./AppBreadcrumb";
import AppHeaderDropdown from "./AppHeaderDropdown";
import {ArrowLeftOutlined, ArrowRightOutlined, ReloadOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router";
import {Button, Dropdown, Image, MenuProps,notification} from "antd";
import {LanguageAction} from "../../../recoil/language/LanguageAction";
import Function from "../../../const/Function";
import {useTranslation} from "react-i18next";
type _T_Props = {
    tool?: ReactNode
    onReload?: Function
}

const AppHeader = (props: _T_Props) => {
    const navigate = useNavigate()
    const {t} = useTranslation();
    const mess = t('text.changeLanguageSuccess')
    const [keyFlag, setKeyFlag] = useState(1)
    const {
        vm,
        dispatchSetState
    } = ThemeAction()
    const {
        dispatchSetLanguage
    } = LanguageAction()
    const {
        setFlag
    } = Function()
    // useEffect(() => {
    //     if (mess) {
    //         // Show notification after the transition
    //         notification.success({
    //             message: mess,
    //             duration: 1,
    //         });
    //     }
    // }, [mess]);
    const items: MenuProps['items'] = [
        {
            label: 'Tiếng Việt',
            key: '1',
            icon: <Image src='https://file.vfo.vn/hinh/2013/12/co-viet-nam-2.jpg' alt="Icon 1" style={{marginRight: '8px', width: '20px', height: '20px'}}/>,
        },
        {
            label: 'English',
            key: '2',
            icon: <Image src={'https://th.bing.com/th/id/OIP.U-h9wYdOSH047roWjY_1TgHaE3?pid=ImgDet&rs=1'} alt="Icon 1" style={{marginRight: '8px', width: '20px', height: '20px'}}/>,
        },
        {
            label: 'China',
            key: '3',
            icon: <Image src={'https://th.bing.com/th/id/OIP.TJhS9Ks-cfxuk8TLTcBWmgHaFQ?w=268&h=190&c=7&r=0&o=5&dpr=1.3&pid=1.7'} alt="Icon 1" style={{marginRight: '8px', width: '20px', height: '20px'}}/>,

        },

    ];
    const handleMenuClick: MenuProps['onClick'] = (e) => {
        if (e.key === "1") {
            dispatchSetLanguage('vi')
            setKeyFlag(1)
        } else if (e.key === "2") {
            dispatchSetLanguage('en')
            setKeyFlag(2)
        } else if (e.key === "3") {
            dispatchSetLanguage('zh')
            setKeyFlag(3)
        }

    };
    const menuProps = {
        items,
        onClick: handleMenuClick,
    };

    return (
        <CHeader position="sticky" className="mb-4">
            <CContainer fluid>
                <CHeaderToggler
                    className="ps-1"
                    onClick={() => dispatchSetState({sidebarShow: !vm.sidebarShow})}
                >
                    <CIcon icon={cilMenu} size="lg"/>
                </CHeaderToggler>
                {/*@ts-ignore*/}
                <CHeaderBrand className="mx-auto d-md-none" to="/">
                    <CIcon icon={logoHeader} height={28}/>
                </CHeaderBrand>
                <CHeaderNav className="d-none d-md-flex me-auto">
                    <CNavItem>
                        <CNavLink className={"cursor-pointer"} onClick={() => navigate(-1)}>
                            <ArrowLeftOutlined style={{fontSize: "1.3rem"}}/>
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink className={"cursor-pointer"} onClick={() => navigate(1)}>
                            <ArrowRightOutlined style={{fontSize: "1.3rem"}}/>
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink
                            className={"cursor-pointer"}
                            disabled={props.onReload === undefined}
                            onClick={(event) => {
                                event.preventDefault()

                                if (props.onReload) {
                                    props.onReload()
                                }
                            }}
                        >
                            <ReloadOutlined style={{fontSize: "1.3rem"}}/>
                        </CNavLink>
                    </CNavItem>
                </CHeaderNav>
                <CHeaderNav className="me-3">
                    <Dropdown menu={menuProps} placement="bottom" arrow>
                        <Button><Image src={setFlag(keyFlag)} alt="Icon 1" style={{marginRight: '8px', width: '20px', height: '20px'}}/> Language</Button>
                    </Dropdown>
                </CHeaderNav>
                <CHeaderNav className="ml-3">
                    <AppHeaderDropdown/>
                </CHeaderNav>
            </CContainer>
            <CHeaderDivider/>
            <CContainer fluid>
                <AppBreadcrumb/>
                {
                    !!props.tool && (
                        <div className={"overflow-x-auto overflow-y-hidden"}>
                            {props.tool}
                        </div>
                    )
                }
            </CContainer>
        </CHeader>
    )
}

export default AppHeader
