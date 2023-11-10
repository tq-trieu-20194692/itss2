import React, {useEffect, useState} from "react";
import {Avatar, Button, Card, Image} from 'antd';
import {MinusCircleOutlined, PlusCircleOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";
import {RouteConfig} from "../../../config/RouteConfig";
import {DiaryListAction} from "../../../recoil/diary/diaryList/DiaryListAction";
import {UrlQuery} from "../../../core/UrlQuery";
import {T_QueryVO} from "../../../models/UserModel";
import {DiaryModel} from "../../../models/DiaryModel";
import noAvatar from "../../../assets/images/no_avatar.jpg";


const {Meta} = Card;
const HomePage = () => {
    const {
        vm: vmDiaryList,
        dispatchGetDiaryList,

    } = DiaryListAction()
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
    const [, setShowMore] = useState(false);
    const [diaryList, setDiaryList] = useState<DiaryModel[]>([])
    const [visibleData, setVisibleData] = useState(6);
    const [showLess, setShowLess] = useState(false);
    const [isHovered, setIsHovered] = useState<number>(-1); // Thêm state để kiểm tra hover
    const data =
        {
            title: "Card1",
            description: "This is the description for Card 1",
            avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel",
            image: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
        }

    useEffect(() => {
        console.log('MOUNT: HomePage Screen');
        // Gọi hàm dispatchGetActivity khi component được mount lại
        dispatchGetDiaryList(new UrlQuery(queryParams).toObject());
        return () => {
            console.log('UNMOUNT: HomePage Screen');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        console.log('vm.isLoading', vmDiaryList.isLoading)
    }, [vmDiaryList.isLoading])

    useEffect(() => {
        console.log('vm.items', vmDiaryList.items)
        setDiaryList(vmDiaryList.items)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vmDiaryList.items])

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
        navigate(`/diary/${value}`)
    }
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
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
                        onClick={() => handleOnClick(item.diaryId)}
                        key={index}
                        style={{
                            width: 400,
                            marginBottom: 16,
                            marginRight: "25px",
                            border: '1px solid #E5DFDD', // Đổi màu viền thay đổi khi hover

                            backgroundColor: isHovered === index ? 'whitesmoke' : 'white' // Sử dụng isHovered để xác định màu nền
                        }}
                        cover={item.image ? (
                            <Image alt="example" src={item.image} style={{
                                height: 300,
                                border: '1px solid #E5DFDD', // Đổi màu viền thay đổi khi hover
                            }}/>
                        ) : (
                            <Image alt="default" src={data.image} style={{height: 300}}/> // Sử dụng ảnh thay thế nếu item.image là undefined
                        )}
                    >
                        <Meta
                            avatar={<Avatar src={noAvatar.src}/>}
                            title={item.name}

                        />
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
        </div>
    );
};

export default HomePage;