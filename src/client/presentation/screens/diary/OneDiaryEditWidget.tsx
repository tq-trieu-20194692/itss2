import {Button, ConfigProvider, Divider, Modal} from 'antd';
import React from "react";
import {useTranslation} from "react-i18next";

export type T_OneDiaryEditWidgetProps = {
    isOpen: boolean
    onClose?: () => void
    id?: string | undefined
}
export const OneDiaryEditWidget = (props: T_OneDiaryEditWidgetProps) => {
    const {t} = useTranslation();
    const onCloseWidget = () => {
        if (props.onClose) {
            props.onClose()
        }
    }
    return (
        <>
            <ConfigProvider>
                <Modal

                    forceRender={false}
                    centered
                    open={props.isOpen}
                    width={550}
                    closable={false}
                    className={"relative"}
                    zIndex={1000}
                    footer={null} // Loại bỏ phần footer mặc định
                >
                    <div style={{textAlign: "center", fontWeight: "bold", fontSize: "24px"}}>
                        <p>{t('text.editArticle')}</p>
                    </div>
                    <Divider/>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <Divider/>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            paddingRight: "20px",
                            marginTop: "20px"
                        }}>
                        <Button
                            style={{marginRight: '10px'}}
                            danger
                            onClick={onCloseWidget}>{t('button.close')}
                        </Button>
                        <Button
                            type="primary"
                            onClick={onCloseWidget}>{t('button.save')}
                        </Button>
                    </div>
                </Modal>
            </ConfigProvider>
        </>
    )
}