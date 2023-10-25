import React, {useEffect, useState} from "react";
import {UserLoginHistoryAction} from "../../../../recoil/user/LoginHistory/UserLoginHistoryAction";
import {Button, List, message, Modal, Popover, Typography} from "antd";
import {getImageForPlatForm} from "../../../../const/Img";
import {T_UserLoginHistoryWidgetProps, UserLoginHistoryWidget} from "./UserLoginHistoryWidget";
import {E_SendingStatus} from "../../../../const/Events";
import {ClockCircleOutlined, EllipsisOutlined, ExclamationCircleOutlined, MinusCircleOutlined} from '@ant-design/icons';
import {cilTrash} from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import Function from "../../../../const/Function";
import {useTranslation} from "react-i18next";

const AccountLoginHistoryScreen = () => {
    const {
        vm: vmLoginHistory,
        vmLogout,
        dispatchHistoryLogin,
        dispatchFarLogout
    } = UserLoginHistoryAction()
    const {
        setIcon,
        setUpDate,
        StateDetail,
        setExpiresAtTime
    } = Function()
    const {t} = useTranslation();
    const [logoutModal, setLogOutModal] = useState(false)
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [accountLoginHistoryWidget, setAccountLoginHistoryWidget] = useState<T_UserLoginHistoryWidgetProps>({
        isOpen: false
    })
    const [logoutIdSession, setLogoutIdSession] = useState<string | undefined>()
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        console.log('MOUNT: Account Login History Screen');
        // Gọi hàm dispatchGetActivity khi component được mount lại
        dispatchHistoryLogin();
        return () => {
            console.log('UNMOUNT: Account Login History Screen');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        console.log('vm.isLoading', vmLoginHistory.isLoading)
    }, [vmLoginHistory.isLoading])

    useEffect(() => {
        console.log('vm.items', vmLoginHistory.items)
        // eslint-disable-next-line react-hooks/exhaustive-deps

    }, [vmLoginHistory.items])

    // useEffect(() => {
    //     console.log("vm.error", vmLoginHistory.error);
    // }, [vmLoginHistory.error]);

    useEffect(() => {
        console.log("vm.error", vmLogout.error);
        if (vmLogout.isLoading !== E_SendingStatus.loading) {
            setLogOutModal(false);
            setConfirmLoading(false);
        }
    }, [vmLogout])

    useEffect(() => {
        console.log(vmLoginHistory)
        if (vmLogout.isLoading === E_SendingStatus.success) {
            messageApi.success(t('message.logoutSuccess')).then()
        } else if (vmLogout.isLoading === E_SendingStatus.error && vmLogout.error) {
            messageApi.error(vmLogout.error.warning).then()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vmLogout]);

    const onCloseWidget = () => {
        setAccountLoginHistoryWidget({
            isOpen: false
        })
    }

    const handleViewDetail = (userId: string | undefined) => {
        if (userId !== undefined) {
            setAccountLoginHistoryWidget({
                isOpen: true,
                id: userId,

            })
        }
    }

    const handleLogoutModalOk = () => {
        setConfirmLoading(true);
        if (logoutIdSession !== undefined) {
            dispatchFarLogout(logoutIdSession)

        }
    }

    const handleLogoutModalCancel = () => {
        setLogOutModal(false);
    };

    const handleLogoutModalOpen = (Session: string | undefined) => {
        setLogOutModal(true);
        setLogoutIdSession(Session)
    };
    return (

        <>
            {contextHolder}
            <h1>{t('text.loginHistory')}</h1>
            <div style={{
                marginTop: '20px',
                paddingLeft: '5vw', // Adjust as needed
                paddingRight: '5vw',
            }}>
                <List
                    dataSource={vmLoginHistory.items}
                    renderItem={(item, index) => (
                        <List.Item
                            style={{

                                border: '2px solid #E5DFDD',
                                borderRadius: '8px',
                                backgroundColor:"white",
                                margin: '10px 0', // Giảm khoảng cách giữa các mục
                                padding: '5px',
                                display: 'flex',
                            }}
                            key={`${item.id}-${index}`}>
                            <div
                                key={item.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    width: '100%', // Fill the available width

                                }}

                            >
                                <div style={{flex: 1}}>
                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={getImageForPlatForm(item.userAgent?.platForm)}
                                            alt="Activity"
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                marginRight: '40px',
                                                marginLeft: '40px'
                                            }}
                                        />
                                        <div style={{flex: 1, textAlign: 'left'}}>
                                            <div>
                                                <div style={{alignItems: 'center'}}>
                                                    <div style={{flex: 1, textAlign: 'left'}}>
                                                        <b>{(item?.userAgent === undefined ? t('text.unknownDevice') : `${item.userAgent.platForm}`)}</b>
                                                        <div style={{alignItems: 'center'}}>
                                                            {(setIcon(item.createdAt) >= 15 ?
                                                                (<ExclamationCircleOutlined style={{marginRight: '8px', color: 'orange'}}/>) : (
                                                                    <ClockCircleOutlined style={{marginRight: '8px'}}/>
                                                                ))}
                                                            <Typography.Text>{setUpDate(item.createdAt)}</Typography.Text>
                                                        </div>
                                                        {setExpiresAtTime(item.expiresAt) && (
                                                            <div>
                                                                <ExclamationCircleOutlined style={{marginRight: '8px', color: 'blue'}}/> <span style={{color: 'blue'}}>{t('text.loginExpires')}</span>
                                                            </div>
                                                        )}
                                                        {(StateDetail(item.state) === true) && (
                                                            <div>
                                                                <MinusCircleOutlined style={{color: '#3b657b', marginRight: '8px'}}/> <span style={{color: 'red'}}>{t('text.Loggedout')}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{position: 'absolute', right: '20px'}}>
                                    {/* Adjusted position and right properties */}
                                    <Popover
                                        placement="bottomRight"
                                        content={
                                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                                <Button onClick={() => handleViewDetail(item.id)} type="text">{t('button.view')}</Button>
                                                <Button type="text" style={{marginTop: '8px', color: 'red'}} onClick={() => handleLogoutModalOpen(item.session)}><CIcon icon={cilTrash} style={{marginRight: '5px'}}/> {t('button.logout')}</Button>
                                            </div>
                                        }
                                        trigger="click"
                                    >
                                        <EllipsisOutlined style={{fontSize: '30px', color: 'blue'}}/>
                                    </Popover>
                                </div>
                            </div>
                        </List.Item>
                    )}
                />
            </div>
            <Modal
                title={t('text.logout')}
                open={logoutModal}
                onOk={handleLogoutModalOk}
                confirmLoading={confirmLoading}
                onCancel={handleLogoutModalCancel}
            >
                <p> {t('text.confirmLogout')}</p>
            </Modal>

            <UserLoginHistoryWidget
                isOpen={accountLoginHistoryWidget.isOpen}
                id={accountLoginHistoryWidget.id}
                onClose={onCloseWidget}
            />
        </>
    )
}
export default AccountLoginHistoryScreen