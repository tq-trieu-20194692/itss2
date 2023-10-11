import {Button, Modal} from "antd";
import {UserActivityLogAction} from "../../../../recoil/user/ActivityLog/UserActivityLogAction";
import React, {useEffect, useState} from "react";
import {ActivityLogModel} from "../../../../models/UserModel";
import {getImageForPlatForm} from "../../../../const/Img";
import CIcon from "@coreui/icons-react";
import {cilLocationPin} from "@coreui/icons";
import {LocationWidget} from "../../../widgets/LocationWidget";
import Function from "../../../../const/Function";
import {useTranslation} from "react-i18next";

export type T_AccountActivityWidgetProps = {
    isOpen: boolean
    onClose?: Function
    ActivityId?: string | undefined
    Refit?:string|undefined
}
export const AccountActivityWidget = (props: { id: string | undefined; refId: string | undefined; onClose: () => void; queryParams: string | object | undefined; isOpen: boolean | undefined; }) => {
    const {
        vm: vmActivity,
    } =UserActivityLogAction()
    const {
        ActivityText,
        setUpDate
    } = Function()
    const {t} = useTranslation();
    const [oneActivity, setOneActivity] = useState<ActivityLogModel>()
    const [selectedLocation, setSelectedLocation] = useState<string|undefined>();
    const [isModalMapVisible, setIsModalMapVisible] = useState(false)

    useEffect(() => {
        console.log('MOUNT: One Activity Screen');

        if (props.id !== undefined) { // Kiểm tra xem props.id có được định nghĩa hay không
            const foundDetail = vmActivity.items.find((detail) => detail.id === props.id);
            setOneActivity(foundDetail)
            console.log(props.id)
        }
        if (props.refId !== undefined) { // Kiểm tra xem props.reFid có được định nghĩa hay không
            // dispatchLoadGetUser(props.refId);
        }
        return () => {
            console.log('UNMOUNT: One Activity Screen');
            setIsModalMapVisible(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.id]);
    useEffect(() => {
        console.log('vm.isLoading', vmActivity.isLoading)
    }, [vmActivity.isLoading])

    useEffect(() => {
        console.log('vm.item', vmActivity.item)


        setOneActivity(vmActivity.item)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vmActivity.item])

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
    }

    return (
        <Modal
            forceRender={false}
            centered
            open={props.isOpen}
            width={450}
            closable={false}
            className={"relative"}
            zIndex={400}
            footer={null} // Loại bỏ phần footer mặc định
        >
            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={getImageForPlatForm(oneActivity?.userAgent?.platForm)}
                    alt="Activity"
                    style={{
                        width: "100px",
                        height: "100px",
                        margin: "0 auto"
                    }}
                />
                <p>
                    <b>
                        {ActivityText(oneActivity?.activity)} {oneActivity?.userAgent === undefined
                        ?  t('text.unknownDevice')
                        : ""}
                    </b>
                </p>
            </div>
            {/*{oneActivity?.refId!==undefined&&(*/}
            {/*    <div>*/}
            {/*        <p style={{marginLeft: 0, paddingLeft: 0}}>*/}
            {/*            <b>Ref Account Name</b>: {vmUser.user?.name}*/}
            {/*        </p>*/}
            {/*    </div>*/}
            {/*)}*/}
            {oneActivity?.userAgent !== undefined && (
                <div>
                    <p style={{marginLeft: 0, paddingLeft: 0}}>
                        <b> {t('text.browser')}</b>: {oneActivity?.userAgent?.browser}
                    </p>
                    <p style={{marginLeft: 0, paddingLeft: 0}}>
                        <b> {t('text.platform')}</b>: {oneActivity?.userAgent?.platForm}
                    </p>
                    <p><b> {t('text.device')}: </b>{oneActivity?.userAgent?.device}</p>
                </div>

            )}

            <p><b>Time: </b>{setUpDate(oneActivity?.createdAt)}</p>
            {oneActivity?.location !== undefined && (
                <div>
                    <p><b> {t('text.location')}</b> : <span style={{fontSize: '15px', color: 'blue', transition: 'color 0.3s'}} onClick={() => handleShowMap(oneActivity?.location)}>{oneActivity.location}<CIcon icon={cilLocationPin}/></span></p>
                </div>

            )}
            {
                isModalMapVisible && (
                    <LocationWidget onClose={onCloseModalMap}
                                    isOpen={true}
                                    location={selectedLocation}

                    />
                )
            }
            <div style={{display: "flex", justifyContent: "flex-end", paddingRight: "20px", marginTop: "20px"}}>
                <Button danger onClick={onCloseWidget}>{t('button.close')}</Button>
            </div>
        </Modal>
    );
};