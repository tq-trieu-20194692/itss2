import React, {ReactNode, useEffect, useState} from 'react';
import {CContainer, CHeader, CHeaderNav, CHeaderBrand,} from '@coreui/react';
import {useTranslation} from 'react-i18next';
import {LanguageAction} from '../../../recoil/language/LanguageAction';
import Function from '../../../const/Function';
import {Button, Dropdown, Image, MenuProps, notification} from 'antd';

type _T_Props = {
    tool?: ReactNode;
    onReload?: Function;
    setOpen?: boolean;
};

const AppHeaderChangePassword = (props: _T_Props) => {
    const {t} = useTranslation();
    const mess = t('text.changeLanguageSuccess');
    const [keyFlag, setKeyFlag] = useState(1);
    const {dispatchSetLanguage} = LanguageAction();
    const {setFlag} = Function();
    useEffect(() => {
        if (mess) {
            notification.success({
                message: mess,
                duration: 1,
            });
        }
    }, [mess]);
    const items: MenuProps['items'] = [
        {
            label: 'Tiếng Việt',
            key: '1',
            icon: (
                <Image
                    src="https://file.vfo.vn/hinh/2013/12/co-viet-nam-2.jpg"
                    alt="Icon 1"
                    style={{marginRight: '8px', width: '20px', height: '20px'}}
                />
            ),
        },
        {
            label: 'English',
            key: '2',
            icon: (
                <Image
                    src={'https://th.bing.com/th/id/OIP.U-h9wYdOSH047roWjY_1TgHaE3?pid=ImgDet&rs=1'}
                    alt="Icon 1"
                    style={{marginRight: '8px', width: '20px', height: '20px'}}
                />
            ),
        },
        {
            label: 'China',
            key: '3',
            icon: (
                <Image
                    src={'https://th.bing.com/th/id/OIP.TJhS9Ks-cfxuk8TLTcBWmgHaFQ?w=268&h=190&c=7&r=0&o=5&dpr=1.3&pid=1.7'}
                    alt="Icon 1"
                    style={{marginRight: '8px', width: '20px', height: '20px'}}
                />
            ),
        },
    ];
    const handleMenuClick: MenuProps['onClick'] = (e) => {
        if (e.key === '1') {
            dispatchSetLanguage('vi');
            setKeyFlag(1);
        } else if (e.key === '2') {
            dispatchSetLanguage('en');
            setKeyFlag(2);
        } else if (e.key === '3') {
            dispatchSetLanguage('zh');
            setKeyFlag(3);
        }
    };
    const menuProps = {
        items,
        onClick: handleMenuClick,
    };
    return (
        <CHeader position="sticky"
                 className="mb-6"
                 style={{backgroundColor: '#001529'}}>
            <CContainer fluid>
                <CHeaderBrand>
                    <div style={{fontSize: '20px', color: 'whitesmoke'}}>
                        <img
                            src="/logo.svg"
                            style={{
                                width: '32px',
                                height: '32px',
                                marginRight: '5px',
                            }}
                            alt=""
                        />
                        AUTOTIMELAPSE
                    </div>
                </CHeaderBrand>
                <CHeaderNav className="d-none d-md-flex me-auto"></CHeaderNav>
                <CHeaderNav className="me-3">
                    <Dropdown menu={menuProps} placement="bottom" arrow>
                        <Button>
                            <Image
                                src={setFlag(keyFlag)}
                                alt="Icon 1"
                                style={{
                                    marginRight: '8px',
                                    width: '20px',
                                    height: '20px'
                                }}
                            />{' '}
                            Language
                        </Button>
                    </Dropdown>
                </CHeaderNav>
                <CHeaderNav className="ml-3">
                </CHeaderNav>
            </CContainer>
        </CHeader>
    );
};

export default AppHeaderChangePassword;
