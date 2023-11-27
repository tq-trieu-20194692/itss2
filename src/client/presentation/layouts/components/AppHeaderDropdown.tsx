import React, { useState } from 'react';
import { CAvatar } from '@coreui/react';
import {cilAccountLogout} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import noAvatar from './../../../assets/images/no_avatar.jpg';
import { MeAction } from '../../../recoil/account/me/MeAction';
import { Card, Dropdown, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { LogoutWidget } from '../../widgets/LogoutWidget';

const AppHeaderDropdown = () => {
    const { t } = useTranslation();
    const [modalApi, contextHolder] = Modal.useModal();

    const { vm: vmMe } = MeAction();
    const [isModalLogoutVisible, setIsModalLogoutVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false); // Thêm state để kiểm tra hover

    const onClickLogout = () => {
        modalApi.confirm({
            zIndex: 1030,
            title: t('text.confirmLogout'),
            icon: <ExclamationCircleOutlined />,
            okText: t('button.ok'),
            cancelText: t('button.close'),
            onOk() {
                setIsModalLogoutVisible(true);
            },
        });
    };

    const onCloseModalLogout = () => {
        setIsModalLogoutVisible(false);
    };


    const userDivStyle = {
        display: 'flex',
        alignItems: 'center',
        padding: '16px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease', // Hiệu ứng hover màu nền
        backgroundColor: isHovered ? 'whitesmoke' : 'white', // Màu chữ đỏ khi hover, ngược lại là đen
    };

    const linkStyle = {
        textDecoration: 'none',
        transition: 'color 0.3s ease', // Hiệu ứng hover màu chữ
        color: isHovered ? 'blue' : 'black', // Màu chữ đỏ khi hover, ngược lại là đen
    };

    return (
        <>
            {contextHolder}
            <Dropdown
                trigger={['click']}
                arrow={{
                    pointAtCenter: true,
                }}

                dropdownRender={(originNode) => (
                    <Card
                        size="small"
                        style={{
                            width: 250,
                        }}
                        bodyStyle={{
                            padding: 0,
                        }}
                    >
                        <div
                            style={userDivStyle}
                            onMouseEnter={() => setIsHovered(true)} // Đặt isHovered thành true khi hover vào
                            onMouseLeave={() => setIsHovered(false)} // Đặt isHovered thành false khi rời ra
                        >
                            <CAvatar
                                src={vmMe.user?.image ?? noAvatar.src}
                                size="md"
                                style={{ marginRight: '16px' }}
                            />
                            <div>
                                <div>
                                    <b>{vmMe.user?.name}</b>
                                </div>
                                <div style={linkStyle} >
                                    {t('text.viewProfile')}
                                </div>
                                {/* Add any other user information here */}
                            </div>
                        </div>
                        {originNode}
                    </Card>
                )}
                menu={{
                    items: [

                        {
                            key: '3',
                            label: t('text.logout'),
                            icon: <CIcon icon={cilAccountLogout} />,
                            onClick: onClickLogout,
                        },
                    ],
                    style: {
                        padding: 0,
                        border: 0,
                        borderRadius: 0,
                        boxShadow: 'none',
                        marginTop: '1px',
                    },
                }}
            >
                <CAvatar  className={'cursor-pointer'} src={vmMe.user?.image ?? noAvatar.src} size="md" />
            </Dropdown>
            {isModalLogoutVisible && <LogoutWidget onClose={onCloseModalLogout} />}
        </>
    );
};

export default AppHeaderDropdown;
