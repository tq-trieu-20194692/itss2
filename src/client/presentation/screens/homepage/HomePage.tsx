import React, {useEffect, useState} from "react";
import {Avatar, Button, Card, Image, message, Modal, Popover} from 'antd';
import {EllipsisOutlined, MinusCircleOutlined, PlusCircleOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";
import {RouteConfig} from "../../../config/RouteConfig";
import {DiaryListAction} from "../../../recoil/diary/diaryList/DiaryListAction";
import {UrlQuery} from "../../../core/UrlQuery";
import {T_QueryVO} from "../../../models/UserModel";
import {DiaryModel} from "../../../models/DiaryModel";
import noAvatar from "../../../assets/images/no_avatar.jpg";
import {EDLocal} from "../../../core/encrypt/EDLocal";
import CIcon from "@coreui/icons-react";
import {cilTrash} from "@coreui/icons";
import {DiaryWidget, T_DiaryEditWidgetProps} from "./DiaryWidget";
import {E_SendingStatus} from "../../../const/Events";
import {DiaryPostListAction} from "../../../recoil/diary/diaryPostList/DiaryPostListAction";

const {Meta} = Card;
const HomePage = () => {
    const {
        vm: vmDiaryList,
        vmDelete,
        dispatchGetDiaryList,
        disPatchLoadID,
        dispatchDeleteDiary
    } = DiaryListAction()
    const {
        dispatchResetDiaryPostState,
    } =DiaryPostListAction()
    const {t} = useTranslation();

    const navigate = useNavigate()
    const URL = new UrlQuery(location.search)
    const page = URL.getInt("page", vmDiaryList.query.page)
    const limit = URL.getInt("limit", vmDiaryList.query.limit)
    const sort = URL.get("sort", vmDiaryList.query.sort)
    const sortBy = URL.get("sort_by", vmDiaryList.query.sortBy)
    const [queryParams] = useState<T_QueryVO>({
        page: page,
        limit: limit,
        sort_by: sortBy,
        sort: sort
    })
    const options = {enableHighAccuracy: true, timeout: 5000, maximumAge: 0,};
    const [, setShowMore] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false)
    const [deleteDiaryId, setDeleteDiaryId] = useState<string | undefined>()
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [diaryWidget, setDiaryWidget] = useState<T_DiaryEditWidgetProps>({
        isOpen: false
    })
    const [messageApi, contextHolder] = message.useMessage();
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [diaryList, setDiaryList] = useState<DiaryModel[]>([])
    const [visibleData, setVisibleData] = useState(6);
    const [showLess, setShowLess] = useState(false);
    const [isHovered, setIsHovered] = useState<number>(-1); // Thêm state để kiểm tra hover
    const [isHoveredButton, setHoveredButton] = useState(false);
    const [locationObtained, setLocationObtained] = useState(false);

    const success = (pos: { coords: any; }) => {
        const crd = pos.coords;
        setLatitude(crd.latitude);
        setLongitude(crd.longitude);
        console.log("Your current position is:");
        console.log(`Latitude : ${crd.latitude}`);
        console.log(`Longitude: ${crd.longitude}`);
        console.log(`More or less ${crd.accuracy} meters.`);
        // Update the loading message to success
        setLocationObtained(true);
    };

    const errors = (err: { code: any; message: any; }) => {
        console.warn(`ERROR(${err.code}): ${err.message}`);
        // Handle error and update the loading message accordingly
        messageApi.error('Loading Error').then();
    };
    const data =
        {
            title: "Card1",
            description: "This is the description for Card 1",
            avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel",
            image: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
        }

    useEffect(() => {
        console.log('MOUNT: HomePage Screen');
        if (!locationObtained) {
            if (navigator.geolocation) {
                navigator.permissions.query({ name: "geolocation" }).then(async function (result) {
                    console.log(result);
                    if (result.state === "granted") {
                        navigator.geolocation.getCurrentPosition(success, errors, options);
                    } else if (result.state === "prompt") {
                        navigator.geolocation.getCurrentPosition(success, errors, options);
                    } else if (result.state === "denied") {
                        messageApi.error(t('Location Permission Denied')).then();
                    }
                });
            } else {
                // Geolocation is not supported by this browser
                console.log("Geolocation is not supported by this browser.");
                messageApi.error(t('message.locationNotSupported')).then();
            }
        }
        // Gọi hàm dispatchGetActivity khi component được mount lại
        const fetchData = async () => {
            try {
                dispatchGetDiaryList(new UrlQuery(queryParams).toObject());
                console.log('dispatchGetDiaryList completed');
            } catch (error) {
                console.error('Error in dispatchGetDiaryList:', error);
            }
        };
        fetchData().then();
        return () => {
            console.log('UNMOUNT: HomePage Screen');
            dispatchResetDiaryPostState()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        console.log('vm.isLoading', vmDiaryList.isLoading)
    }, [vmDiaryList.isLoading])

    useEffect(() => {
        console.log('vm.items', vmDiaryList.items)
        const fetchData = async () => {
            setDiaryList(vmDiaryList.items);
        };
        fetchData().then();

    }, [vmDiaryList.items])

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
            messageApi.error(t('message.deleteError')).then()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vmDelete]);
    const handleShowMore = () => {
        const nextVisibleData = visibleData + 3;
        if (nextVisibleData >= diaryList.length) {
            setShowMore(false);
            setShowLess(true); // Khi hiển thị tất cả dữ liệu, hiển thị nút "Hiển thị ít hơn"
        }
        setVisibleData(nextVisibleData);
    }
    const handleShowLess = () => {
        setVisibleData(6); // Đặt lại số lượng hiển thị về 6 khi ấn nút "Hiển thị ít hơn"
        setShowLess(false); // Ẩn nút "Hiển thị ít hơn" và hiển thị nút "Tải thêm" lại
        setShowMore(true);
    }
    const handleOnClick = (value: string | undefined) => {
        console.log(value)
        if (value !== undefined) {
            EDLocal.setLocalStore("diaryId", value)
            disPatchLoadID(value)
        }
        navigate(RouteConfig.ONE_DIARY)

    }
    const handleEditDiary = (diaryId: string | undefined) => {
        if (diaryId !== undefined) {
            setDiaryWidget({
                isOpen: true,
                id: diaryId,
                method: false
            })
        }
    }
    const handleNewDiary = () => {
            setDiaryWidget({
                isOpen: true,
                method:true
            })

    }
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
        setDeleteDiaryId(diaryPostId)

    };
    const handleDeleteModalOk = () => {
        setConfirmLoading(true);
        if (deleteDiaryId !== undefined) {
            const data = {
                _method: 'DELETE',
                lat: latitude,
                lng: longitude,

            }
            dispatchDeleteDiary(deleteDiaryId, data)
        }
    }
    const onCloseWidget = () => {
        setDiaryWidget({
            isOpen: false
        })
    }
    return (
        <>
            {contextHolder}
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative", // Làm cho container trở nên relative để có thể sử dụng absolute positioning
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    {diaryList.slice(0, visibleData).map((item, index) => (
                        <Card
                            onMouseEnter={() => setIsHovered(index)} // Đặt isHovered thành chỉ mục của phần tử khi hover vào
                            onMouseLeave={() => setIsHovered(-1)} // Đặt isHovered thành -1 khi rời ra

                            key={index}
                            style={{
                                width: 400,
                                marginBottom: 16,
                                marginRight: "25px",
                                border: '1px solid #E5DFDD', // Đổi màu viền thay đổi khi hover

                                backgroundColor: isHovered === index ? 'whitesmoke' : 'white' // Sử dụng isHovered để xác định màu nền
                            }}
                            cover={item.image ? (
                                <Image alt="example"
                                       src={item.image}
                                       style={{
                                           height: 300,
                                           border: '1px solid #E5DFDD',
                                       }}
                                       onClick={() => handleOnClick(item.diaryId)}
                                />
                            ) : (
                                <Image alt="default" src={data.image} style={{height: 300}}
                                       onClick={() => handleOnClick(item.diaryId)}
                                />

                            )}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}
                            >
                                {/* Left side content (avatar, title, description) */}
                                <div style={{width:300}}>
                                <Meta
                                    style={{maxHeight:100}}
                                    avatar={<Avatar src={noAvatar.src}/>}
                                    title={item.name}
                                    description={
                                        <div style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                                            {item.description}
                                        </div>
                                    }
                                />
                                </div>
                                {/* Right side icons */}
                                <div>
                                    <Popover
                                        placement="bottomRight"
                                        content={
                                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                                <Button onClick={() => handleEditDiary(item.diaryId)} type="text">{t('text.edit')}</Button>
                                                <Button onClick={() => handleDeleteModalOpen(item.diaryId, item.location)} type="text" style={{marginTop: '8px', color: 'red'}}>
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
                        </Card>
                    ))}
                </div>
                {diaryList.length > visibleData && !showLess && (
                    <Button
                        onClick={handleShowMore}
                        style={{marginTop: "20px", marginBottom: "20px"}}
                        type="primary"
                        icon={<PlusCircleOutlined/>}
                    >
                        {t('button.showMore')}
                    </Button>
                )}
                {showLess && (
                    <Button
                        onClick={handleShowLess}
                        style={{marginTop: "20px", marginBottom: "20px"}}
                        type="default"
                        icon={<MinusCircleOutlined/>}
                    >
                        {t('button.showLess')}

                    </Button>
                )}
                <div
                    style={{
                        position: "fixed",
                        bottom: 40,
                        right: 40,
                        zIndex: 1, // Đặt mức z-index cao hơn để giữ nó trên các phần tử khác
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#019A8F',
                            display: 'flex',
                            alignItems: 'center',
                            borderRadius: '20px',
                            position: 'relative',

                        }}
                        onMouseEnter={() => setHoveredButton(true)} // Đặt isHovered thành chỉ mục của phần tử khi hover vào
                        onMouseLeave={() => setHoveredButton(false)}
                        onClick={handleNewDiary}
                    >
                        <PlusCircleOutlined style={{fontSize: '40px'}}/>
                        <span style={{color:"white",marginLeft: '8px', fontSize: '20px',paddingRight: '8px',display:isHoveredButton ? "inline" : "none"
                        }}>NEW</span>
                    </div>

                </div>
                <Modal
                    title={t('text.confirmDelete')}
                    open={deleteModal}
                    onOk={handleDeleteModalOk}
                    confirmLoading={confirmLoading}
                    onCancel={handleDeleteModalCancel}
                >
                </Modal>
                <DiaryWidget
                    isOpen={diaryWidget.isOpen}
                    id={diaryWidget.id}
                    onClose={onCloseWidget}
                    method={diaryWidget.method}
                />
            </div>
        </>
    );
};

export default HomePage;