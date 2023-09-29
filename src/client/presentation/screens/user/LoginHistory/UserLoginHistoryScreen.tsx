import React, {useEffect, useState} from "react";
import {UserLoginHistoryAction} from "../../../../recoil/user/LoginHistory/UserLoginHistoryAction";
import {LoginHistoryModel} from "../../../../models/UserModel";
import {Button, message, Modal, Popover, Typography} from "antd";
import {getImageForPlatForm} from "../../../../const/Img";
import {UserLoginHistoryWidget, T_AccountLoginHistoryWidgetProps} from "./UserLoginHistoryWidget";
import {E_SendingStatus} from "../../../../const/Events";
import {ClockCircleOutlined, EllipsisOutlined, ExclamationCircleOutlined, MinusCircleOutlined} from '@ant-design/icons';
import {setIcon, setUpDate} from "../../../../const/Function";
import {cilTrash} from "@coreui/icons";
import CIcon from "@coreui/icons-react";

const UserLoginHistoryScreen = () => {
    const {
        vm: vmLoginHistory,
        vmLogout,
        dispatchHistoryLogin,
        dispatchFarLogout
    } = UserLoginHistoryAction()
    const [logoutModal, setLogOutModal] = useState(false)
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [accountLoginHistoryWidget, setAccountLoginHistoryWidget] = useState<T_AccountLoginHistoryWidgetProps>({
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
            messageApi.success('Đăng xuất thành công').then()
        } else if (vmLogout.isLoading === E_SendingStatus.error && vmLogout.error) {
            messageApi.error(vmLogout.error.account).then()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vmLogout]);

    const handleViewDetail = (idSession: string | undefined) => {
        if (idSession !== undefined) {
            console.log(idSession)
            setAccountLoginHistoryWidget({
                isOpen: true,
                idSession: idSession,

            })
        }
    }
    const onCloseWidget = () => {
        setAccountLoginHistoryWidget({
            isOpen: false
        })
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

    const handleLogoutModalOpen = (idSession: string | undefined) => {
        console.log(idSession)
        setLogOutModal(true);
        setLogoutIdSession(idSession)
    };
    const groupedData: Record<string, any> = {};

    // Group data by id
    vmLoginHistory.items.forEach((item) => {
        let platForm = item.history?.userAgent?.platForm;
        if (platForm === undefined) {
            platForm = "Unknown"
        }
        if (!groupedData[platForm]) {
            groupedData[platForm] = [];
        }
        groupedData[platForm].push(item);

    });


    return (
        <>
            {contextHolder}
            <h1>Lịch sử đăng nhập</h1>
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
                                <p><b>Phiên hoạt động trên thiết bị {id}</b></p>
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
                                                    <p><b> Đã Đăng nhập {item.history?.userAgent === undefined ? " trên thiết bị không xác định" : ""}  </b></p>
                                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                                        {(setIcon(item.history?.createdAt) >= 15 ?
                                                            (<ExclamationCircleOutlined style={{marginRight: '8px' ,color:'orange'}}/>) : (
                                                                <ClockCircleOutlined style={{marginRight: '8px'}}/>
                                                            ))}
                                                        <Typography.Text>{setUpDate(item.history?.createdAt)}</Typography.Text>
                                                    </div>
                                                    {(item.history?.key === "admin.user.logout.far" || item.history?.key === "admin.user.logout" || item.history?.key === "admin.user.logout.all") && (
                                                        <div>
                                                            <MinusCircleOutlined style={{color: '#3b657b', marginRight: '8px'}}/> <span style={{color: 'red'}}>Đã đăng xuất</span>
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
                                                        <Button onClick={() => handleViewDetail(item.history?.idSession)} type="text">Xem chi tiết</Button>
                                                        <Button type="text" style={{marginTop: '8px', color: 'red'}} onClick={() => handleLogoutModalOpen(item.history?.idSession)}><CIcon icon={cilTrash} style={{marginRight: '5px'}}/> Đăng xuất</Button>
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
                title="Đăng xuất"
                open={logoutModal}
                onOk={handleLogoutModalOk}
                confirmLoading={confirmLoading}
                onCancel={handleLogoutModalCancel}
            >
                <p>Bạn xác định Đăng xuất tại thiết bị này ❓</p>
            </Modal>

            <UserLoginHistoryWidget
                isOpen={accountLoginHistoryWidget.isOpen}
                id={accountLoginHistoryWidget.idSession}
                onClose={onCloseWidget}
            />
        </>
    )
}
export default UserLoginHistoryScreen