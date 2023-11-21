import {ClockCircleOutlined, EllipsisOutlined, EnvironmentOutlined} from "@ant-design/icons";
import {Avatar, Button, Divider, Image, message, Modal, notification, Popover, Tooltip} from "antd";
import React, {useEffect, useState} from "react";
import {WiHumidity, WiStrongWind, WiThermometer} from "react-icons/wi";
import {AiOutlineAim, AiOutlineCopy} from "react-icons/ai";
import { ImageGrid } from "react-fb-image-video-grid";
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
import ImageSS from "./Image";

const OneDiaryScreen = () => {
    const {
        vm: vmDiaryPost,
        vmDelete,
        dispatchDeleteDiaryPost,
        dispatchGetDiaryListPost,
    } = DiaryPostListAction()
    const {
        // vm: vmDiary,
    } = DiaryListAction()
    const {
        ChangeTime,
        decimalToDMS,
        setUpDateForDiaryPost
    } = Function()
    const {t} = useTranslation();
    const [diaryId] = useState<string>(
        () => {
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
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);

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
        const fetchData = async () => {
            try {
                dispatchGetDiaryListPost(diaryId, new UrlQuery(queryParams).toObject());
                console.log('dispatchGetDiaryListPost completed');
            } catch (error) {
                console.error('dispatchGetDiaryListPost:', error);
            }
        };
        fetchData().then();
        return () => {
            console.log('UNMOUNT: Diary Post  Screen');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [diaryId]);

    useEffect(() => {
        console.log('vm.isLoading', vmDiaryPost.isLoading)
    }, [vmDiaryPost.isLoading])

    useEffect(() => {
        console.log('vm.items', vmDiaryPost.items)
        const fetchData = async () => {
            setDiaryListPost(vmDiaryPost.items);
        };
        fetchData().then();
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
    const handleDeleteModalOpen = (diaryPostId: string | undefined, coordinatesArray: string | undefined) => {
        if (coordinatesArray !== undefined) {
            const locationArray = coordinatesArray.split(',');
            const lat: number = parseFloat(locationArray[0]);
            const long: number = parseFloat(locationArray[1]);
            setLatitude(lat)
            setLongitude(long)
        }
        setDeleteModal(true);
        setDeleteDiaryPost(diaryPostId)
    };
    const handleDeleteModalOk = () => {
        setConfirmLoading(true);
        if (deleteDiaryPostId !== undefined) {
            const data = {
                _method: 'DELETE',
                lat: latitude,
                lng: longitude,

            }
            dispatchDeleteDiaryPost(deleteDiaryPostId, data)

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

    const  handleEditDiaryPost = (diaryPostId: string | undefined) => {
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
    const  images =[
    'https://th.bing.com/th?id=OIP.9U6ZvbMYvlmVJ7RwuBaajAHaLJ&w=203&h=306&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2',
        'https://th.bing.com/th?id=OIP.m8FhePi93frBy7Q9vEBGZQHaEo&w=316&h=197&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2',
        'https://th.bing.com/th?id=OIP.m8FhePi93frBy7Q9vEBGZQHaEo&w=316&h=197&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2',
        'https://th.bing.com/th?id=OIP.m8FhePi93frBy7Q9vEBGZQHaEo&w=316&h=197&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2',
    ]

    return (
        <>
            {contextHolder}
            <div style={{
                marginTop: '10px',
                maxWidth: 900,
                paddingLeft: '5vw',
                paddingRight: '5vw',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center', // Căn giữa theo chiều ngang
                marginLeft: 'auto',
                marginRight: 'auto',
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
                                    <div>
                                        {item.updateAt !== undefined ? (
                                            setUpDateForDiaryPost(item.updateAt)
                                        ) : (
                                            setUpDateForDiaryPost(item.createAt)
                                        )}</div>
                                </Tooltip>
                            </div>
                            <div style={{position: 'absolute', right: '0'}}>
                                {/* Adjusted position and right properties */}
                                <Popover
                                    placement="bottomRight"
                                    content={
                                        <div style={{display: 'flex', flexDirection: 'column'}}>
                                            <Button onClick={() => handleEditDiaryPost(item.postDiaryId)} type="text">{t('text.edit')}</Button>
                                            <Button onClick={() => handleDeleteModalOpen(item.postDiaryId, item.location)} type="text" style={{marginTop: '8px', color: 'red'}}>
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
                            {item.description}
                        </div>
                        <div style={{marginTop: '10px'}}>
                           {/*<FbImageLibrary*/}
                           {/*    images={images}*/}
                           {/*    width={80}*/}
                           {/*/>*/}
                            <ImageSS count={2} images={images} />
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
