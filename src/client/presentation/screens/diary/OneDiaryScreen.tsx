import {ClockCircleOutlined, EllipsisOutlined, EnvironmentOutlined} from "@ant-design/icons";
import {Avatar, Button, Divider, Image, message, Modal, notification, Popover, Tooltip} from "antd";
import React, {useEffect, useState} from "react";
import {WiHumidity, WiStrongWind, WiThermometer} from "react-icons/wi";
import {AiOutlineAim, AiOutlineCopy} from "react-icons/ai";

import {useTranslation} from "react-i18next";
import {PostDiaryModel} from "../../../models/DiaryModel";
import {DiaryPostListAction} from "../../../recoil/diary/diaryPostList/DiaryPostListAction";
import {UrlQuery} from "../../../core/UrlQuery";
import {T_QueryVO} from "../../../models/UserModel";
import {DiaryListAction} from "../../../recoil/diary/diaryList/DiaryListAction";
import noAvatar from "../../../assets/images/no_avatar.jpg";
import Function from "../../../const/Function";
import CIcon from "@coreui/icons-react";
import {cilTrash} from "@coreui/icons";
import {OneDiaryEditWidget, T_OneDiaryEditWidgetProps} from "./OneDiaryEditWidget";
import {E_SendingStatus} from "../../../const/Events";
import {EDLocal} from "../../../core/encrypt/EDLocal";
import {MapWidget} from "../../widgets/MapWidget";

const OneDiaryScreen = () => {
    const {
        vm: vmDiaryPost,
        vmDelete,
        dispatchDeleteDiaryPost,
        dispatchGetDiaryListPost,
        dispatchResetDiaryPostState
    } = DiaryPostListAction()
    const {
        vm: vmDiary,
    } = DiaryListAction()
    const {
        ChangeTime,
        decimalToDMS,
        setUpDateForDiaryPost
    } = Function()
    const {t} = useTranslation();
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
    const [deleteModal, setDeleteModal] = useState(false)
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [deleteDiaryPostId, setDeleteDiaryPost] = useState<string | undefined>()
    const [oneDiaryEditWidget, setOneDiaryEditWidget] = useState<T_OneDiaryEditWidgetProps>({
        isOpen: false
    })

    const [messageApi, contextHolder] = message.useMessage();
    const [DiaryListPost, setDiaryListPost] = useState<PostDiaryModel[]>([])
    const [isModalMapVisible, setIsModalMapVisible] = useState(false)
    const [selectedCoordinate, setSelectedCoordinate] = useState<[number | undefined, number | undefined]>([0, 0]);
    const URL = new UrlQuery(location.search)
    const page = URL.getInt("page", vmDiaryPost.query.page)
    const limit = URL.getInt("limit", vmDiaryPost.query.limit)
    const sort = URL.get("sort", vmDiaryPost.query.sort)
    const sortBy = URL.get("sort_by", vmDiaryPost.query.sortBy)
    const [queryParams] = useState<T_QueryVO>({
        page: page,
        limit: limit,
        sort_by: sortBy,
        sort: sort
    })
    useEffect(() => {
        console.log('MOUNT: Diary Post Screen');
        console.log(vmDiary)
        // Gọi hàm dispatchGetActivity khi component được mount lại
        dispatchGetDiaryListPost(diaryId, new UrlQuery(queryParams).toObject());
        return () => {
            console.log('UNMOUNT: Diary Post  Screen');
            dispatchResetDiaryPostState()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [diaryId]);

    useEffect(() => {
        console.log('vm.isLoading', vmDiaryPost.isLoading)
    }, [vmDiaryPost.isLoading])

    useEffect(() => {
        console.log('vm.items', vmDiaryPost.items)
        setDiaryListPost(vmDiaryPost.items)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vmDiaryPost.items])
    useEffect(() => {
        console.log("vm.error", vmDelete.error);
        if (vmDelete.isLoading !== E_SendingStatus.loading) {
            setDeleteModal(false);
            setConfirmLoading(false);
        }
    }, [vmDelete])
    useEffect(() => {
        if (vmDelete.isLoading === E_SendingStatus.success) {
            messageApi.success(t('message.deleteSuccess')).then()
        } else if (vmDelete.isLoading === E_SendingStatus.error && vmDelete.error) {
            messageApi.error(vmDelete.error.warning).then()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vmDelete]);

    const handleDeleteModalCancel = () => {
        setDeleteModal(false);
    };
    const handleDeleteModalOpen = (diaryPostId: string | undefined) => {
        setDeleteModal(true);
        setDeleteDiaryPost(diaryPostId)
    };
    const handleDeleteModalOk = () => {
        setConfirmLoading(true);
        if (deleteDiaryPostId !== undefined) {
            dispatchDeleteDiaryPost(deleteDiaryPostId)
            console.log("chua co api nen chua test duoc")
        }
    }
    const handleCopyToClipboard = async (dataToCopy: string | undefined) => {
        if (dataToCopy !== undefined) {
            try {
                await navigator.clipboard.writeText(dataToCopy);
                notification.success({
                    message: t('message.copySuccess'),
                    description: `${t('text.coord')}: ${dataToCopy}`,
                    duration: 1,
                });
                console.log('Copied to clipboard:', dataToCopy);
            } catch (err) {
                console.error('Unable to copy to clipboard', err);
            }
        }
    };

    const handleEditDiaryPost = (diaryPostId: string | undefined) => {
        if (diaryPostId !== undefined) {
            setOneDiaryEditWidget({
                isOpen: true,
                id: diaryPostId,

            })
        }
    }
    const onCloseWidget = () => {
        setOneDiaryEditWidget({
            isOpen: false
        })
    }
    const handleShowMap = (coordinate: any) => {
        const coordinatesArray: string[] = coordinate.split(',');
        // Chuyển đổi các phần tử từ chuỗi sang số
        const lat: number = parseFloat(coordinatesArray[0]);
        const long: number = parseFloat(coordinatesArray[1]);

        // Cập nhật state với giá trị mới
        setSelectedCoordinate([lat, long]);
        setIsModalMapVisible(true)

    }
    const onCloseModalMap = () => {
        setIsModalMapVisible(false)
    }
    return (
        <>
            {contextHolder}
            <div style={{
                marginTop: '20px',
                paddingLeft: '5vw',
                paddingRight: '5vw',
            }}>
                {DiaryListPost.map((item) => (
                    <div style={{
                        border: '2px solid #E5DFDD',
                        borderRadius: '8px',
                        backgroundColor: "white",
                        margin: '20px 0',
                        paddingLeft: '30px',
                        paddingRight: '30px',
                        paddingTop: "15px",
                        alignItems: 'center',
                        // Thêm thuộc tính position: 'relative'

                    }}
                         key={item.postDiaryId}
                    >
                        <div style={{display: 'flex', alignItems: 'center', marginRight: '20px', position: 'relative'}}>
                            <Avatar
                                src={noAvatar.src}
                                alt="Activity"
                                size={50}
                            />
                            <div style={{marginLeft: '10px'}}>
                                <div style={{fontWeight: 'bold'}}>{item.name}</div>
                                <Tooltip placement="top" title={ChangeTime(item.createAt)}>
                                    <div style={{fontWeight: 'lighter'}}>{setUpDateForDiaryPost(item.createAt)}</div>
                                </Tooltip>
                            </div>
                            <div style={{position: 'absolute', right: '0'}}>
                                {/* Adjusted position and right properties */}
                                <Popover
                                    placement="bottomRight"
                                    content={
                                        <div style={{display: 'flex', flexDirection: 'column'}}>
                                            <Button onClick={() => handleEditDiaryPost(item.postDiaryId)} type="text">{t('text.edit')}</Button>
                                            <Button onClick={() => handleDeleteModalOpen(item.postDiaryId)} type="text" style={{marginTop: '8px', color: 'red'}}>
                                                <CIcon icon={cilTrash} style={{marginRight: '5px'}}/> {t('text.delete')}
                                            </Button>
                                        </div>
                                    }
                                    trigger="click"
                                >
                                    <EllipsisOutlined style={{fontSize: '20px', color: 'blue'}}/>
                                </Popover>
                            </div>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', marginTop: '5px'}}>
                            <AiOutlineAim style={{marginRight: '3px', fontSize: "20px"}}/> {item.address?.display}
                        </div>
                        {/*lỗi khi thu nhỏ màn hình*/}
                        <div style={{display: 'flex', alignItems: 'center', marginTop: '5px'}}>
                            <div style={{marginRight: '20px'}}>
                                <Tooltip placement="top" title={t("text.temp")}>
                                    <WiThermometer style={{marginRight: '3px', fontSize: "20px"}}/> {item.weather?.main?.temp}
                                </Tooltip>
                            </div>
                            <div style={{marginRight: '20px'}}>
                                <Tooltip placement="top" title={t("text.humid")}>
                                    <WiHumidity style={{fontSize: "25px"}}/> {item.weather?.main?.humidity} %
                                </Tooltip>
                            </div>
                            <div style={{marginRight: '20px'}}>
                                <Tooltip placement="top" title={t("text.windSpeed")}>
                                    <WiStrongWind style={{marginRight: '3px'}}/> {item.weather?.wind?.speed} m/s
                                </Tooltip>
                            </div>
                            <div>
                                <Tooltip placement="top" title={t("text.infoReTime")}>
                                    <ClockCircleOutlined style={{marginRight: '3px'}}/> {ChangeTime(item.createAt)}
                                </Tooltip>
                            </div>
                        </div>
                        <Divider/>
                        <div>
                            <Image src="https://res-gdta.autotimelapse.com/files/dmi/08-2023/wELl3QrRlVybROn_1691368158_327WXu.jpg"
                                   alt="diaryImage"
                            />
                        </div>
                        <Divider/>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <div style={{marginRight: '20px', paddingBottom: '20px', display: 'inline-flex', alignItems: 'center'}}>
                                <Tooltip placement="top" title={t('text.viewMapinfo')}>
                                    <EnvironmentOutlined style={{marginRight: '3px', fontSize: '18px'}}/>
                                    <span
                                        className="ant-typography cursor-pointer hover:underline"
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',

                                        }}
                                        onClick={() => handleShowMap(item.location)}
                                    >
                               {decimalToDMS(item.location)} </span>
                                </Tooltip>
                                <Tooltip placement="top" title={t("text.copy")}>
                                    <AiOutlineCopy onClick={() => handleCopyToClipboard(item.location)} style={{marginRight: '3px', color: 'blue', marginLeft: '10px', fontSize: '18px'}}/>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                ))}
                <Modal
                    title={t('text.confirmDelete')}
                    open={deleteModal}
                    onOk={handleDeleteModalOk}
                    confirmLoading={confirmLoading}
                    onCancel={handleDeleteModalCancel}
                >
                </Modal>
                <OneDiaryEditWidget
                    isOpen={oneDiaryEditWidget.isOpen}
                    id={oneDiaryEditWidget.id}
                    onClose={onCloseWidget}
                />
                {
                    isModalMapVisible && (
                        <MapWidget
                            onClose={onCloseModalMap}
                            isOpen={isModalMapVisible}
                            coordinate={selectedCoordinate}
                        />
                    )
                }
            </div>
        </>
    );
};

export default OneDiaryScreen;
