import React, {useEffect, useState} from 'react'
import {CContainer, CHeader, CHeaderNav, CHeaderToggler, CNavItem} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {cilIndentDecrease, cilIndentIncrease} from '@coreui/icons'
import {ThemeAction} from "../../../recoil/theme/ThemeAction";
import AppHeaderDropdown from "./AppHeaderDropdown";
import {Button, Dropdown, Image, MenuProps} from "antd";
import {LanguageAction} from "../../../recoil/language/LanguageAction";
import Function from "../../../const/Function";
import {HomeOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router";
import {RouteConfig} from "../../../config/RouteConfig";
import {DiaryListAction} from "../../../recoil/diary/diaryList/DiaryListAction";
import {EDLocal} from "../../../core/encrypt/EDLocal";
import {DiaryModel} from "../../../models/DiaryModel";

// type _T_Props = {
//     tool?: ReactNode
//     onReload?: Function
// }

const AppHeaderForDiary = () => {
    const {
        vm,
        dispatchSetState
    } = ThemeAction()
    const {
        vm: vmDiaryList,
    } = DiaryListAction()
    const {
        vm: vmLanguage,
        dispatchSetLanguage
    } = LanguageAction();
    const [diaryId]=useState<string>(
        ()=>{
            try {
                const id = EDLocal.getLocalStore('diaryId')
                if (id) {
                    return id
                }
            } catch (e) {
                console.error(e)
            }
            return ''
        }
    )
    const [foundDetail,setFoundDetail] = useState<DiaryModel>()
    const [keyFlag, setKeyFlag] = useState(vmLanguage.languageNum);
    const [isHovered, setIsHovered] = useState(false); // Thêm state để kiểm tra hover
    const navigate = useNavigate()
    const {
        setFlag
    } = Function()
    //
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

    useEffect(() => {
        const detail = vmDiaryList.items.find((detail) => detail.diaryId === diaryId);
        setFoundDetail(detail)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [diaryId]);

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        if (e.key === "1") {
            dispatchSetLanguage('vi', 1)
            setKeyFlag(1)
        } else if (e.key === "2") {
            dispatchSetLanguage('en', 2)

            setKeyFlag(2)
        } else if (e.key === "3") {
            dispatchSetLanguage('zh', 3)
            setKeyFlag(3)
        }

    };
    const menuProps = {
        items,
        onClick: handleMenuClick,
    };
    const onHomePageClick =()=>{
        navigate(RouteConfig.HOME_PAGE)
    }
    return (
        <>
            <CHeader position="sticky" style={{ backgroundColor: '#001529' }}>
                <CContainer fluid>
                    <CHeaderNav className="d-md-flex me-auto">
                        <CNavItem>
                            <div
                                onMouseEnter={() => setIsHovered(true)} // Đặt isHovered thành chỉ mục của phần tử khi hover vào
                                onMouseLeave={() => setIsHovered(false)}
                                onClick={onHomePageClick}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor:isHovered ? 'whitesmoke' : 'white',
                                    border:`1px solid ${isHovered ? 'blue' : 'white'}`,
                                    borderRadius: '50%',
                                    width: '40px', // Adjust the width to expand the container
                                    height: '40px',
                                }}
                            >
                                <HomeOutlined style={{
                                    color: isHovered ? 'blue' : 'black',
                                    fontSize: '20px'
                                }} />
                            </div>
                        </CNavItem>
                        <CNavItem></CNavItem>
                    </CHeaderNav>
                    <CHeaderNav className="me-3">
                        <Dropdown menu={menuProps} placement="bottom" arrow>
                            <Button>
                                <Image
                                    src={setFlag(keyFlag)}
                                    alt="Icon 1"
                                    style={{ marginRight: '8px', width: '20px', height: '20px' }}
                                />{' '}
                                Language
                            </Button>
                        </Dropdown>
                    </CHeaderNav>
                    <CHeaderNav className="ml-3">
                        <AppHeaderDropdown />
                    </CHeaderNav>
                </CContainer>
            </CHeader>

            <div style={{display: 'flex', alignItems: 'center', height: '50px', backgroundColor:'white'}}>
                <CHeaderToggler style={{marginLeft:'20px',}}
                    onClick={() => dispatchSetState({ sidebarShow: !vm.sidebarShow })}
                >
                    {!vm.sidebarShow ? (
                        <CIcon icon={cilIndentIncrease} size="lg" style={{marginRight:"20px"}} />
                    ) : (
                        <CIcon icon={cilIndentDecrease} size="lg" style={{marginRight:"20px"}}/>
                    )}
                    <span style={{ fontWeight: 'bold' }}>{foundDetail?.name}</span>
                </CHeaderToggler>
                <hr style={{ width: '1px', height: '20px', border: '1px', color: 'red', backgroundColor: '#fff', margin: '0' }} />
            </div>
        </>
    );
};

export default AppHeaderForDiary;
