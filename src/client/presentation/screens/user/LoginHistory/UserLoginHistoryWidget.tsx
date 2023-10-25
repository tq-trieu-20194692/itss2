import {Button, Modal} from "antd";
import React, {useEffect, useState} from "react";
import {LoginHistoryModel} from "../../../../models/UserModel";
import {getImageForPlatForm} from "../../../../const/Img";
import {UserLoginHistoryAction} from "../../../../recoil/user/LoginHistory/UserLoginHistoryAction";
import {LocationWidget} from "../../../widgets/LocationWidget";
import CIcon from "@coreui/icons-react";
import {cilLocationPin} from "@coreui/icons";
import Function from "../../../../const/Function";
import {useTranslation} from "react-i18next";

export type T_UserLoginHistoryWidgetProps = {
    isOpen: boolean
    onClose?: Function
    id?: string | undefined
}

export const UserLoginHistoryWidget = (props: {
    id: string | undefined;
    onClose: () => void;
    isOpen: boolean | undefined;
}) => {
    const {
        vm: vmLoginHistory
    } = UserLoginHistoryAction()
    const {
        ActivityText,
    } = Function()
    const {t} = useTranslation();
    const [oneLoginDetail, setOneLoginDetail] = useState<LoginHistoryModel>()
    const [selectedLocation, setSelectedLocation] = useState<string | undefined>();
    const [isModalMapVisible, setIsModalMapVisible] = useState(false)
    let createAt: Date | undefined;
    if (oneLoginDetail?.createdAt) {
        createAt = new Date(oneLoginDetail.createdAt);
    }
    useEffect(() => {
        console.log('MOUNT: One Activity Screen');
        // Gọi hàm dispatchGetActivity khi component được mount lại
        if (props.id !== undefined) { // Kiểm tra xem props.id có được định nghĩa hay không
            const foundDetail = vmLoginHistory.items.find((detail) => detail.id === props.id);
            setOneLoginDetail(foundDetail)
            console.log(props.id)

        }
        return () => {
            console.log('UNMOUNT: One Activity Screen');
            setIsModalMapVisible(false)
        }
    }, [props.id, vmLoginHistory.items]);
    useEffect(() => {
        console.log('vm.isLoading', vmLoginHistory.isLoading)
    }, [vmLoginHistory.isLoading])

    useEffect(() => {
        console.log('vm.item', vmLoginHistory.item)
        setOneLoginDetail(vmLoginHistory.item)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vmLoginHistory.item])

    const onCloseWidget = () => {
        if (props.onClose) {
            props.onClose()
        }
    }
    const handleShowMap = (coordinate: any) => {
        setSelectedLocation(coordinate)
        setIsModalMapVisible(true)
    }
    const onCloseModalMap = () => {
        setIsModalMapVisible(false)
        setOneLoginDetail(undefined)
    }

    return (
        <Modal
            forceRender={false}
            centered
            open={props.isOpen}
            width={600}
            closable={false}
            className={"relative"}
            zIndex={1000}
            footer={null} // Loại bỏ phần footer mặc định
        >
            <div
                style={{
                    display: "flex",
                    marginBottom: "16px",
                    marginTop: '10px'
                }}>
                <div style={{flex: 1}}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginRight: '20px'
                        }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={getImageForPlatForm(oneLoginDetail?.userAgent?.platForm)}
                            alt="Activity"
                            style={{
                                width: '70px',
                                height: '70px',
                                marginLeft: '40px',
                            }}
                        />
                    </div>
                </div>
                <div style={{flex: 2}}>
                    <div>
                        <div style={{fontSize: '20px'}}>
                            {oneLoginDetail?.userAgent !== undefined ? (<div>
                                {oneLoginDetail.userAgent.platForm}
                            </div>) : (<div>
                                {t('text.unknownDevice')}
                            </div>)}
                        </div>
                    </div>
                    <p>
                        {createAt?.toLocaleString()}
                    </p>
                    <p>
                        {t('text.lastActivity')} : {ActivityText(oneLoginDetail?.activity)}
                    </p>
                    {oneLoginDetail?.userAgent?.browser !== undefined && (
                        <p>
                            {t('text.browser')} : {oneLoginDetail?.userAgent?.browser}
                        </p>
                    )}
                    {oneLoginDetail?.userAgent?.device !== undefined && (
                        <p>
                            {t('text.device')} : {oneLoginDetail?.userAgent?.device}
                        </p>
                    )}

                    {oneLoginDetail?.location !== undefined && (
                        <div>
                            <p>{t('text.location')} :
                                <span
                                    style={{
                                        fontSize: '15px',
                                        color: 'blue',
                                        transition: 'color 0.3s',
                                        marginTop: '10px',
                                        marginBottom: '10px'
                                    }}
                                    onClick={() => handleShowMap(oneLoginDetail?.location)}> {oneLoginDetail.location}
                                    <CIcon icon={cilLocationPin}/>
                            </span>
                            </p>
                        </div>

                    )}

                    {
                        isModalMapVisible && (
                            <LocationWidget
                                onClose={onCloseModalMap}
                                isOpen={isModalMapVisible}
                                location={selectedLocation}
                            />
                        )
                    }
                </div>

            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    paddingRight: "20px",
                    marginTop: "20px"
                }}>
                <Button
                    danger
                    onClick={onCloseWidget}>{t('button.close')}
                </Button>
            </div>
        </Modal>
    );
};