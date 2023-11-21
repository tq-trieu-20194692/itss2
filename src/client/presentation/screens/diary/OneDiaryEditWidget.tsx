import {Button, Divider, Drawer, Form, Input, message, Modal, UploadProps} from 'antd';
import React, {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {Utils} from "../../../core/Utils";
import {FieldData} from "rc-field-form/lib/interface";
import {DiaryPostListAction} from "../../../recoil/diary/diaryPostList/DiaryPostListAction";
import {PostDiaryModel} from "../../../models/DiaryModel";
import {E_SendingStatus} from "../../../const/Events";

export type T_OneDiaryEditWidgetProps = {
    isOpen: boolean
    onClose?: () => void
    id?: string | undefined
}
export type T_FormEditDiaryPost = {
    _method?: string
    description?: string
    name?: string
    lat: number | null
    lng: number | null,
    image?: string[]
}
type _T_FormName = {
    name: string
    description: string
}
type _T_FormError = {
    [K in keyof _T_FormName]?: _T_FormName[K];
};
export const OneDiaryEditWidget = (props: T_OneDiaryEditWidgetProps) => {
    const {
        vm: vmDiaryPost,
        dispatchEditDiaryPost,
        vmForm
    } = DiaryPostListAction()
    const {t} = useTranslation();
    const [, setDiaryPost] = useState<PostDiaryModel>()

    const inputTimeoutRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
    const [formErrors, setFormErrors] = useState<_T_FormError>({});
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);

    useEffect(() => {
        console.log('MOUNT: DiaryPost Edit Widget Screen');
        // Gọi hàm dispatchGetActivity khi component được mount lại
        if (props.id !== undefined) { // Kiểm tra xem props.id có được định nghĩa hay không
            const foundDetail = vmDiaryPost.items.find((detail) => detail.postDiaryId === props.id);
            setDiaryPost(foundDetail)
            form.setFieldsValue({
                name: foundDetail?.name || "",
                description: foundDetail?.description,
            });
            if (foundDetail?.location !== undefined) {
                const locationArray = foundDetail?.location.split(',');
                const lat: number = parseFloat(locationArray[0]);
                const long: number = parseFloat(locationArray[1]);
                setLatitude(lat)
                setLongitude(long)
            }
        }
        return () => {
            console.log('UNMOUNT: DiaryPost Edit Widget Screen');

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.id]);
    useEffect(() => {
        if ( vmForm.isLoading === E_SendingStatus.success) {
            messageApi.success(t('message.saveSuccess')).then()
            if (props.onClose) {
                props.onClose()
            }
            form.resetFields()
        } else if ( vmForm.isLoading === E_SendingStatus.error &&  vmForm.error) {
            messageApi.error(t('message.saveError')).then()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vmForm]);
    const onFieldsChange = (data: FieldData[]) => {
        let _formErrors = formErrors;
        data.forEach((e: any) => {
            switch (e.name[0]) {
                case 'name':
                    if (inputTimeoutRef.current.name) clearTimeout(inputTimeoutRef.current.name);

                    if (e.errors.length > 0) {
                        inputTimeoutRef.current.name = setTimeout(() => {
                            setFormErrors((error) => ({
                                ...error,
                                name: e.errors[0],
                            }));
                        }, 1000);
                    } else if (_formErrors.name) {
                        _formErrors = {
                            ..._formErrors,
                            name: '',
                        };
                    }

                    break;
                case 'description':
                    if (inputTimeoutRef.current.description) clearTimeout(inputTimeoutRef.current.description);

                    if (e.errors.length > 0) {
                        inputTimeoutRef.current.description = setTimeout(() => {
                            setFormErrors((error) => ({
                                ...error,
                                description: e.errors[0],
                            }));
                        }, 1000);
                    } else if (_formErrors.description) {
                        _formErrors = {
                            ..._formErrors,
                            description: '',
                        };
                    }
                    break;
            }
        });
        setFormErrors(_formErrors);
    }
    const onCloseWidget = () => {
        if (props.onClose) {
            props.onClose()
        }
    }
    const onFinish = async (values: any) => {
        console.log("onFinish:", values);
        const data: T_FormEditDiaryPost = {
            ...values,
            _method: 'PUT',
            lat: latitude,
            lng: longitude,
            // image: values?.image
        }
        dispatchEditDiaryPost(props.id, data)
    }
    const onFinishFailed = (errorInfo: any) => {
        console.log("onFinishFailed:", errorInfo);
    };
    return (
        <>
            {contextHolder}
            <Modal
                forceRender={false}
                open={props.isOpen}
                width={500}
                closable={false}
                className={"relative"}
                zIndex={1000}
                footer={null} // Loại bỏ phần footer mặc định
            >
                <div style={{textAlign: "center", fontWeight: "bold", fontSize: "24px"}}>
                    <p>{t('text.editArticle')}</p>
                </div>
                <Divider/>
                <div style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center", margin: "auto" }}>
                    <Form
                        name="basic"
                        labelCol={{span: 5}}
                        wrapperCol={{span: 20}}
                        style={{maxWidth: 1000, width: 650}}
                        initialValues={{remember: true}}
                        onFinish={onFinish}
                        onFieldsChange={onFieldsChange}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        form={form}

                    >
                        <Form.Item
                            label={t('text.name')}
                            name="name"
                            rules={[{
                                required: true,
                                message: t('error.required', {
                                    label: t('text.name').toLowerCase(),
                                }),
                            },
                                {
                                    min: 3,
                                    max: 30,
                                    message: t('error.length', {
                                        label: t('text.name'),
                                        min: 3,
                                        max: 100,
                                    }),
                                },]}
                            validateStatus={Utils.viewStatusError<_T_FormError>(formErrors, 'name')}
                            help={Utils.viewHelpError<_T_FormError>(formErrors, 'name')}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label={t('text.description')}
                            name="description"
                            rules={[{
                                required: true,
                                message: t('error.required', {
                                    label: t('text.description').toLowerCase(),
                                }),
                            },
                                {
                                    min: 3,
                                    max: 100,
                                    message: t('error.length', {
                                        label: t('text.description'),
                                        min: 3,
                                        max: 30,
                                    }),
                                },]}
                        >
                            <Input.TextArea maxLength={400} style={{minHeight: 160}}/>
                        </Form.Item>
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
                                htmlType="submit"
                            >{t('button.save')}
                            </Button>
                        </div>
                    </Form>
                </div>
            </Modal>
        </>
    )
}