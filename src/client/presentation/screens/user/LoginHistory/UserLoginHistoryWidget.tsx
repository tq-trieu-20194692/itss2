import {Button, Modal} from "antd";
import React, {useEffect, useState} from "react";
import {LoginHistoryModel} from "../../../../models/UserModel";
import {getImageForPlatForm} from "../../../../const/Img";
import {UserLoginHistoryAction} from "../../../../recoil/user/LoginHistory/UserLoginHistoryAction";
import {LocationWidget} from "../../../widgets/LocationWidget";
import CIcon from "@coreui/icons-react";
import { cilLocationPin } from "@coreui/icons";
import {ActivityText} from "../../../../const/Function";

export type T_AccountLoginHistoryWidgetProps = {
    isOpen: boolean
    onClose?: Function
    idSession?: string | undefined
}

export const UserLoginHistoryWidget = (props: { id: string | undefined; onClose: () => void; isOpen: boolean | undefined; }) => {
    const {
        vm: vmLoginHistory,
        dispatchOneDetail
    } = UserLoginHistoryAction()

    const [oneLoginDetail, setOneLoginDetail] = useState<LoginHistoryModel>()
    const [selectedCoordinate, setSelectedCoordinate] = useState<[number | undefined, number | undefined]>([0, 0]);
    const [isModalMapVisible, setIsModalMapVisible] = useState(false)

    useEffect(() => {
        console.log('MOUNT: One Activity Screen');
        // Gọi hàm dispatchGetActivity khi component được mount lại
        if (props.id !== undefined) { // Kiểm tra xem props.id có được định nghĩa hay không
            dispatchOneDetail(props.id)
        }
        return () => {
            console.log('UNMOUNT: One Activity Screen');
            setIsModalMapVisible(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.id]);
    useEffect(() => {
        console.log('vm.isLoading', vmLoginHistory.isLoading)
    }, [vmLoginHistory.isLoading])

    useEffect(() => {
        console.log('vm.item', vmLoginHistory.item)
        setOneLoginDetail(vmLoginHistory.item)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vmLoginHistory.item])

    const changeDate = (date: string | undefined) => {
        const createdAt = date ?? "No date available";
        const dateTime = new Date(createdAt);
        dateTime.getFullYear();
        const month = (dateTime.getMonth() + 1).toString().padStart(2, "0"); // Tháng bắt đầu từ 0, nên cộng 1 và định dạng thành 2 chữ số
        const day = dateTime.getDate().toString().padStart(2, "0");
        const hours = dateTime.getHours().toString().padStart(2, "0");
        const minutes = dateTime.getMinutes().toString().padStart(2, "0");
        return `${day} tháng ${month}, ${hours}:${minutes}`
    }

    const onCloseWidget = () => {
        if (props.onClose) {
            props.onClose()
        }
    }
    const handleShowMap = (coordinate: any) => {
        const trimmedString = coordinate.replace(/\s/g, ""); // Xóa khoảng trắng
        const parsedArray = JSON.parse(trimmedString);
        setIsModalMapVisible(true)
        setSelectedCoordinate(parsedArray)
    }
    const onCloseModalMap = () => {
        setIsModalMapVisible(false)
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
            <div style={{display: "flex", marginBottom: "16px", marginTop: '10px'}}>
                <div style={{flex: 1}}>
                    <div style={{display: 'flex', alignItems: 'center', marginRight: '20px'}}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={getImageForPlatForm(oneLoginDetail?.history?.userAgent?.platForm)}
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
                            {oneLoginDetail?.history?.userAgent !== undefined ? (<div>
                                {oneLoginDetail.history.userAgent.platForm}
                            </div>) : (<div>
                                Thiết bị không xác định
                            </div>)}
                        </div>
                    </div>
                    <p>
                        {oneLoginDetail?.history?.createdAt ? changeDate(oneLoginDetail.history.createdAt).toString() : "No date available"}
                    </p>
                    <p>
                        Hoạt động lần cuối : {ActivityText(oneLoginDetail?.history?.key)}
                    </p>
                    {oneLoginDetail?.history?.userAgent?.browser!==undefined&&(
                        <p>
                            Browser : {oneLoginDetail?.history?.userAgent?.browser}
                        </p>
                    )}
                    {oneLoginDetail?.history?.userAgent?.device!==undefined&&(
                        <p>
                            Device : {oneLoginDetail?.history?.userAgent?.device}
                        </p>
                    )}

                    {oneLoginDetail?.history?.location !== undefined && (
                        <div>
                            <p>Location: <span style={{fontSize:'15px',color: 'blue', transition: 'color 0.3s',marginTop:'10px',marginBottom:'10px' }} onClick={()=>handleShowMap(oneLoginDetail?.history?.location)} >{oneLoginDetail.history?.location}<CIcon icon={cilLocationPin}/></span> </p>
                        </div>

                    )}

                    {
                        isModalMapVisible && (
                            <LocationWidget onClose={onCloseModalMap} isOpen={isModalMapVisible} coordinate={selectedCoordinate}
                            />
                        )
                    }
                </div>

            </div>
            <div style={{display: "flex", justifyContent: "flex-end", paddingRight: "20px", marginTop: "20px"}}>
                <Button danger onClick={onCloseWidget}>Close</Button>
            </div>
        </Modal>
    );
};