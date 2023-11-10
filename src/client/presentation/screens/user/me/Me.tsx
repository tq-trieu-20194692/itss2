import React, {useEffect, useState} from "react";
import {MeAction} from "../../../../recoil/account/me/MeAction";
import {Col, Row, Avatar, Modal} from "antd";
import {useTranslation} from "react-i18next";
import CIcon from '@coreui/icons-react';
import {cilPen} from "@coreui/icons";

const MeScreen = () => {
    const {vm, dispatchLoadMe} = MeAction();

    useEffect(() => {
        dispatchLoadMe();
    }, []);

    const {t} = useTranslation();
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState("");

    const handlePreview = async (file) => {
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

    const handleChangePassword = () => {
        // Add your logic here to handle the password change action
        // For example, you can open a modal or navigate to a new page for changing the password.
        // You can use state or a library like Ant Design Modal to implement the password change form.
        console.log("Change Password button clicked");
    };

    function handleMouseOver(e: any) {
        if (e.target instanceof HTMLElement) {
            e.target.style.backgroundColor = "rgb(3, 108, 102)";
        }
    }

    function handleMouseOut(e: any) {
        if (e.target instanceof HTMLElement) {
            e.target.style.backgroundColor = "rgb(3, 155, 145)";
        }
    }

    return (
        <div>
            <h1 className="text-center">
                {t("text.personalInfo")}
            </h1>
            <div className="text-center">{t("text.profileSaved")}</div>
            <br/>
            {vm?.user ? (
                    <div>
                        <div
                            style={{
                                background: "#fff",
                                padding: "16px",
                                borderRadius: "8px",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <Row gutter={[16, 16]}>
                                <Col span={12}>
                                    <div>
                                        <h5 style={{color: "blue"}}>{t("text.basicInfo")}</h5>
                                        <hr/>
                                    </div>
                                    <div>
                                        <div>
                                            {t("text.username")}: {vm.user.username}
                                        </div>
                                        <hr/>
                                    </div>
                                    <div>
                                        <div>
                                            {t("text.fullname")}: {vm.user.name}
                                            <CIcon icon={cilPen} size="sm" style={{float: "right"}}/>
                                        </div>
                                        <hr/>
                                    </div>
                                    <div>
                                        <div>
                                            {t("text.address")}: {vm.user.address}
                                            <CIcon icon={cilPen} size="sm" style={{float: "right"}}/>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={6} offset={6}>
                                    <Row gutter={[16, 16]}>
                                        <Col span={24}>
                                            <div style={{textAlign: "center"}}>
                                                <div
                                                    style={{
                                                        borderBottom: "1px solid #ccc",
                                                        marginBottom: "8px",
                                                    }}
                                                >
                                                    {t("text.profilePhoto")}
                                                </div>
                                                <div>
                                                    <Avatar
                                                        size={150}
                                                        src={vm.user.image}
                                                        alt="User Avatar"
                                                        // onClick={() => handlePreview(vm.user.image)}
                                                        style={{cursor: "pointer"}}
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                        <div>
                            <Row gutter={[16, 16]}>
                                <Col span={24}>
                                    <div
                                        style={{
                                            background: "#fff",
                                            padding: "16px",
                                            borderRadius: "8px",
                                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                            marginTop: "16px",
                                        }}
                                    >
                                        <div>
                                            <h5 style={{color: "blue"}}>{t("text.contactInfo")} </h5>
                                            <hr/>
                                        </div>
                                        <div>
                                            <div>
                                                {t("text.email")}: {vm.user.email}
                                                <CIcon icon={cilPen} size="sm" style={{float: "right"}}/>
                                            </div>
                                            <hr/>
                                        </div>
                                        <div>
                                            <div>
                                                {t("text.phone")}: {vm.user.phone}
                                                <CIcon icon={cilPen} size="sm" style={{float: "right"}}/>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <div>
                            <Row gutter={[16, 16]}>
                                <Col span={24}>
                                    <div
                                        style={{
                                            background: "#fff",
                                            padding: "16px",
                                            borderRadius: "8px",
                                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                            marginTop: "16px",
                                        }}
                                    >
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <div style={{ display: "flex", alignItems: "center" }}>
                                                    <h5 style={{ color: "blue", marginRight: "10px" }}>{t("text.password")}</h5>
                                                </div>
                                                <button
                                                    onClick={handleChangePassword}
                                                    style={{
                                                        backgroundColor: "rgb(3, 155, 145)",
                                                        color: "black",
                                                        padding: "8px 16px",
                                                        border: "none",
                                                        cursor: "pointer",
                                                        transition: "background-color 0.3s",
                                                    }}
                                                    onMouseOver={(e) => handleMouseOver(e)}
                                                    onMouseOut={(e) => handleMouseOut(e)}
                                                >
                                                    Change Password
                                                </button>
                                            </div>
                                            <div>{t("text.passwordInfoMess")}</div>
                                        </div>
                                        <hr />
                                        <div>{t("text.password")}: ******</div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <br/>
                    </div>

                )
                : null}
            <Modal
                open={previewVisible}
                onCancel={handleCancelPreview}
                footer={null}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div
                    style={{
                        width: "50%",
                        paddingBottom: "50%",
                        borderRadius: "50%",
                        overflow: "hidden",
                    }}
                >
                    <img
                        alt="preview"
                        style={{maxWidth: "100%", height: "auto"}}
                        src={previewImage}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default MeScreen;