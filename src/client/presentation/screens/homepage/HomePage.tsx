import React, {useState} from "react";
import {Avatar, Button, Card, Image} from 'antd';
import {MinusCircleOutlined, PlusCircleOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";
import {RouteConfig} from "../../../config/RouteConfig";


const {Meta} = Card;
const HomePage = () => {
    const {t} = useTranslation();
    const navigate = useNavigate()
    const [, setShowMore] = useState(false);
    const [visibleData, setVisibleData] = useState(6);
    const [showLess, setShowLess] = useState(false);
    const [isHovered, setIsHovered] = useState<number>(-1); // Thêm state để kiểm tra hover
    const data = [
        {
            title: "Card1",
            description: "This is the description for Card 1",
            avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel",
            image: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
        },
        {
            title: "Card2",
            description: "This is the description for Card 2",
            avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel",
            image: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
        },
        {
            title: "Card3",
            description: "This is the description for Card 3",
            avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel",
            image: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
        },
        {
            title: "Card4",
            description: "This is the description for Card 4",
            avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel",
            image: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
        },
        {
            title: "Card5",
            description: "This is the description for Card 5",
            avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel",
            image: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
        },
        {
            title: "Card6",
            description: "This is the description for Card 6",
            avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel",
            image: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
        },
        {
            title: "Card6",
            description: "This is the description for Card 6",
            avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel",
            image: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
        },
        {
            title: "Card6",
            description: "This is the description for Card 6",
            avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel",
            image: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
        },
        {
            title: "Card6",
            description: "This is the description for Card 6",
            avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel",
            image: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
        }, {
            title: "Card6",
            description: "This is the description for Card 6",
            avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel",
            image: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
        },
        {
            title: "Card6",
            description: "This is the description for Card 6",
            avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel",
            image: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
        },
        {
            title: "Card 6",
            description: "This is the description for Card 6",
            avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel",
            image: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
        },
        {
            title: "Card 6",
            description: "This is the description for Card 6",
            avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel",
            image: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
        },
        {
            title: "Card 6",
            description: "This is the description for Card 6",
            avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel",
            image: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
        },

    ];
    const handleShowMore = () => {
        const nextVisibleData = visibleData + 3;
        if (nextVisibleData >= data.length) {
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
    const handleOnClick = (value:string) => {
        console.log(value)
        navigate(RouteConfig.ONE_DIARY)

    }
    return (
        <div
            style={{
                backgroundColor: "#F0F2F5",
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
                {data.slice(0, visibleData).map((item, index) => (
                    <Card
                        onMouseEnter={() => setIsHovered(index)} // Đặt isHovered thành chỉ mục của phần tử khi hover vào
                        onMouseLeave={() => setIsHovered(-1)} // Đặt isHovered thành -1 khi rời ra
                        onClick={()=>handleOnClick(item.title)}
                        key={index}
                        style={{
                            width: 400,
                            marginBottom: 16,
                            marginRight: "25px",
                            backgroundColor: isHovered === index ? 'whitesmoke' : 'white' // Sử dụng isHovered để xác định màu nền
                        }}
                        cover={<Image alt="example" src={item.image}/>}
                    >
                        <Meta
                            avatar={<Avatar src={item.avatar}/>}
                            title={item.title}
                            description={item.description}
                        />
                    </Card>
                ))}
            </div>
            {data.length > visibleData && !showLess && (
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