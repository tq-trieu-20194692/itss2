import React, {useState} from "react";
import {Avatar, Button, Card} from 'antd';
import {MinusCircleOutlined, PlusCircleOutlined} from "@ant-design/icons";
const {Meta} = Card;
const HomePage = () => {
    const [showMore, setShowMore] = useState(false);
    const [visibleData, setVisibleData] = useState(6); // Số lượng phần tử hiển thị ban đầu
    const [showLess, setShowLess] = useState(false); // Thêm biến trạng thái showLess

    const data = [
        {
            title: "Card 1",
            description: "This is the description for Card 1",
            avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel",
            image: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
        },
        {
            title: "Card 2",
            description: "This is the description for Card 2",
            avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel",
            image: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
        },
        {
            title: "Card 3",
            description: "This is the description for Card 3",
            avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel",
            image: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
        },
        {
            title: "Card 4",
            description: "This is the description for Card 4",
            avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel",
            image: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
        },
        {
            title: "Card 5",
            description: "This is the description for Card 5",
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
        {
            title: "Card 6",
            description: "This is the description for Card 6",
            avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel",
            image: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
        }, {
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

        // Thêm dữ liệu cho nhiều hơn 6 card nếu cần
    ];
    const handleShowMore = () => {
        const nextVisibleData = visibleData + 3;
        if (nextVisibleData >= data.length) {
            setShowMore(false);
            setShowLess(true); // Khi hiển thị tất cả dữ liệu, hiển thị nút "Hiển thị ít hơn"
        }
        setVisibleData(nextVisibleData);
    };
    const handleShowLess = () => {
        setVisibleData(6); // Đặt lại số lượng hiển thị về 6 khi ấn nút "Hiển thị ít hơn"
        setShowLess(false); // Ẩn nút "Hiển thị ít hơn" và hiển thị nút "Tải thêm" lại
        setShowMore(true);
    };
    return (
        <div style={{ backgroundColor: "#F0F2F5", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
                {data.slice(0, visibleData).map((item, index) => (
                    <Card
                        key={index}
                        style={{ width: 400, marginBottom: 16, marginRight: "25px" }}
                        cover={<img alt="example" src={item.image} />}
                    >
                        <Meta
                            avatar={<Avatar src={item.avatar} />}
                            title={item.title}
                            description={item.description}
                        />
                    </Card>
                ))}
            </div>
            {data.length > visibleData && !showLess && (
                <Button onClick={handleShowMore} style={{ marginTop: "20px", marginBottom: "20px" }} type="primary" icon={<PlusCircleOutlined />}>
                    Show more
                </Button>
            )}
            {showLess && (
                <Button onClick={handleShowLess} style={{ marginTop: "20px", marginBottom: "20px" }} type="default" icon={<MinusCircleOutlined />}>
                    Show less
                </Button>
            )}
        </div>
    );
};

export default HomePage;
