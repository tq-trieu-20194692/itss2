import React, {useEffect, useState} from "react";
import {UserLoginHistoryAction} from "../../../../recoil/user/LoginHistory/UserLoginHistoryAction";
import {LoginHistoryModel} from "../../../../models/UserModel";
import {Button, message, Modal, Popover, Typography} from "antd";
import {getImageForPlatForm} from "../../../../const/Img";
import {UserLoginHistoryWidget, T_UserLoginHistoryWidgetProps} from "./UserLoginHistoryWidget";
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
        StateDetail
    } = Function()
    const {t} = useTranslation();
    const [logoutModal, setLogOutModal] = useState(false)
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [accountLoginHistoryWidget, setAccountLoginHistoryWidget] = useState<T_UserLoginHistoryWidgetProps>({
        isOpen: false
    })
    const [logoutIdSession, setLogoutIdSession] = useState<string | undefined>()
    const [messageApi, contextHolder] = message.useMessage();
    const groupedData: Record<string, any> = {};
    vmLoginHistory.items.forEach((item) => {
        let platForm = item.userAgent?.platForm;
        if (platForm === undefined) {
            platForm = "Unknown"
        }
        if (!groupedData[platForm]) {
            groupedData[platForm] = [];
        }
        groupedData[platForm].push(item);

    });

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
            dispatchHistoryLogin()
        }
    }

    const handleLogoutModalCancel = () => {
        setLogOutModal(false);
    };

    const handleLogoutModalOpen = (Session: string | undefined) => {
        console.log(Session)
        setLogOutModal(true);
        setLogoutIdSession(Session)
    };
    return (
        <>
            {contextHolder}
            <h1>{t('text.loginHistory')}</h1>
            <div>
                {Object.entries(groupedData).map(([id, items]) => (
                    <div key={id} style={{display: "flex", marginBottom: "16px", border: '1px solid #ccc', borderRadius: '20px', marginTop: '10px'}}>
                        <div style={{flex: 1}}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <div style={{display: 'flex', alignItems: 'center', marginRight: '20px'}}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={getImageForPlatForm(id)}
                                    alt="Activity"
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        marginLeft: '45px',
                                        marginRight: '20px', // Điều chỉnh khoảng cách giữa ảnh và span
                                    }}
                                />
                                <p><b> {t('text.sessionOnDevice')} {id}</b></p>
                            </div>
                        </div>
                        <div style={{flex: 2}}>
                            {items.map((item: LoginHistoryModel, index: React.Key | null | undefined) => (
                                <div key={index} style={{borderBottom: index === items.length - 1 ? 'none' : '1px solid #ccc'}}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            margin: '10px 0',
                                        }}
                                    >
                                        <div>
                                            <div style={{alignItems: 'center'}}>
                                                <div style={{flex: 1, textAlign: 'left'}}>
                                                    <p><b>  {(item?.userAgent === undefined ? t('text.unknownDevice') : `${id}`)}  </b></p>
                                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                                        {(setIcon(item.createdAt) >= 15 ?
                                                            (<ExclamationCircleOutlined style={{marginRight: '8px', color: 'orange'}}/>) : (
                                                                <ClockCircleOutlined style={{marginRight: '8px'}}/>
                                                            ))}
                                                        <Typography.Text>{setUpDate(item.createdAt)}</Typography.Text>
                                                    </div>
                                                    {(StateDetail(item.state) === true) && (
                                                        <div>
                                                            <MinusCircleOutlined style={{color: '#3b657b', marginRight: '8px'}}/> <span style={{color: 'red'}}>{t('text.Loggedout')}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{position: 'absolute', right: 0, marginRight: '40px'}}>
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
                                                <EllipsisOutlined style={{fontSize: '30px', color: 'blue', marginRight: '40px'}}/>
                                            </Popover>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                ))}
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