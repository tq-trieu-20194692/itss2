import React, {useEffect, useState} from "react";
import {MeAction} from "../../../../recoil/account/me/MeAction";
import {Col, Row, Modal, Avatar} from 'antd';
import {useTranslation} from "react-i18next";

const MeScreen = () => {
    const {
        vm,
        dispatchLoadMe,
        dispatchUpdateMeImage,
    } = MeAction();

    useEffect(() => {
        dispatchLoadMe();
    }, []);
    const {t} = useTranslation();
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    const handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64({file: file.originFileObj});
        }
        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
    };

    const handleCancelPreview = () => {
        setPreviewVisible(false);
    };

    const getBase64 = ({file}: { file: any }) => {
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
                {t('text.personalInfo')}
            </h1>
            <div className="text-center">
                {t('text.profileSaved')}
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
                                    <h5 style={{color: 'blue'}}>{t('text.basicInfo')}</h5>
                                    <hr/>
                                </div>
                                <div>
                                    {t('text.username')}: {vm.user.username}
                                    <hr/>
                                </div>
                                <div>
                                    {t('text.name')}: {vm.user.name}
                                    <hr/>
                                </div>
                                <div>
                                    {t('text.address')}: {vm.user.address}
                                </div>
                            </Col>
                            <Col span={6} offset={6}>
                                <Row gutter={[16, 16]}>
                                    <Col span={24}>
                                        <div style={{textAlign: 'center'}}>
                                            <div style={{borderBottom: '1px solid #ccc', marginBottom: '8px'}}>
                                                {t('text.profilePhoto')}
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
                                    <h5 style={{color: 'blue'}}> {t('text.contactInfo')} </h5>
                                    <hr/>
                                </div>
                                <div>
                                    {t('text.email')}: {vm.user.email}
                                    <hr/>
                                </div>
                                <div>
                                    {t('text.phone')}: {vm.user.phone}
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
                                    <h5 style={{color: 'blue'}}> {t('text.password')}</h5>
                                    {t('text.passwordInfoMess')}
                                    <hr/>
                                </div>
                                <div>
                                    {t('text.password')}: ******
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
