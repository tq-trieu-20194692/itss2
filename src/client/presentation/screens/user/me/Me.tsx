import React, {useEffect, useState} from "react";
import {MeAction} from "../../../../recoil/account/me/MeAction";
import {Col, Row, Modal, Avatar} from 'antd';

const MeScreen = () => {
    const {
        vm,
        dispatchLoadMe,
        dispatchUpdateMeImage,
    } = MeAction();

    useEffect(() => {
        dispatchLoadMe();
    }, []);

    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    const handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
    };

    const handleCancelPreview = () => {
        setPreviewVisible(false);
    };

    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    return (
        <div>
            <h1 className="text-center">
                Thông tin cá nhân
            </h1>
            <div className="text-center">
                Thông tin cá nhân của bạn được lưu trên Autotimelapse
            </div>
            <br/>
            {vm?.user && (
                <div>
                    <div style={{
                        background: '#fff',
                        padding: '16px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                    }}>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <div>
                                    <h5 style={{color: 'blue'}}>Thông tin cơ bản</h5>
                                    <hr/>
                                </div>
                                <div>
                                    Tài khoản: {vm.user.username}
                                    <hr/>
                                </div>
                                <div>
                                    Tên: {vm.user.name}
                                    <hr/>
                                </div>
                                <div>
                                    Địa chỉ: {vm.user.address}
                                </div>
                            </Col>
                            <Col span={6} offset={6}>
                                <Row gutter={[16, 16]}>
                                    <Col span={24}>
                                        <div style={{textAlign: 'center'}}>
                                            <div style={{borderBottom: '1px solid #ccc', marginBottom: '8px'}}>
                                                Ảnh hồ sơ
                                            </div>
                                            <div>
                                                <Avatar
                                                    size={150}
                                                    src={vm.user.image}
                                                    alt="User Avatar"
                                                />
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <div style={{
                                background: '#fff',
                                padding: '16px',
                                borderRadius: '8px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                marginTop: '16px'
                            }}>
                                <div>
                                    <h5 style={{color: 'blue'}}>Thông tin liên hệ </h5>
                                    <hr/>
                                </div>
                                <div>
                                    Email: {vm.user.email}
                                    <hr/>
                                </div>
                                <div>
                                    Số điện thoại: {vm.user.phone}
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <div style={{
                                background: '#fff',
                                padding: '16px',
                                borderRadius: '8px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                marginTop: '16px'
                            }}>
                                <div>
                                    <h5 style={{color: 'blue'}}>Mật khẩu</h5>
                                    Mật khẩu là nơi để bảo vệ tài khoản của bạn
                                    <hr/>
                                </div>
                                <div>
                                    Mật khẩu: ******
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <br/>
                </div>
            )}

            {/* Image Preview Modal */}
            <Modal
                open={previewVisible}
                onCancel={handleCancelPreview}
                footer={null}
            >
                <img alt="Preview" style={{width: '100%'}} src={previewImage}/>
            </Modal>
        </div>
    );
};

export default MeScreen;
