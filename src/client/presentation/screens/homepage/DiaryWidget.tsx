import type {UploadProps} from 'antd';
import {Button, ConfigProvider, Divider, Form, Input, message, Modal, Upload} from 'antd';
import React, {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {InboxOutlined} from "@ant-design/icons";
import {DiaryListAction} from "../../../recoil/diary/diaryList/DiaryListAction";
import {DiaryModel} from "../../../models/DiaryModel";
import {E_SendingStatus} from "../../../const/Events";
import {FieldData} from "rc-field-form/lib/interface";
import {Utils} from "../../../core/Utils";

export type T_FormEditDiary = {
    _method?: string
    description?: string
    name?: string
    lat: number | null
    lng: number | null,
    image: File
}
export type T_FormAddDiary = {

    description?: string
    name?: string
    location?: string
    image: File
}
export type T_DiaryEditWidgetProps = {
    isOpen: boolean
    onClose?: () => void
    id?: string | undefined
    method?: boolean //true là ADD, false là EDIT
}
const {Dragger} = Upload;
type _T_FormName = {
    name: string
    description: string
    image: string
}
type _T_FormError = {
    [K in keyof _T_FormName]?: _T_FormName[K];
};
export const DiaryWidget = (props: T_DiaryEditWidgetProps) => {
    const {
        vm: vmDiaryList,
        dispatchEditDiary,
        dispatchAddDiary,
        vmForm
    } = DiaryListAction()
    const options = {enableHighAccuracy: true, timeout: 5000, maximumAge: 0,};
    const {t} = useTranslation();
    const [messageApi, contextHolder] = message.useMessage();
    const [uploadDisabled, setUploadDisabled] = useState(false);
    const [form] = Form.useForm();
    const [formErrors, setFormErrors] = useState<_T_FormError>({});
    const inputTimeoutRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
    const [diary, setDiary] = useState<DiaryModel>()
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [file, setFile] = useState<File>()
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

                case 'image':
                    if (inputTimeoutRef.current.image) clearTimeout(inputTimeoutRef.current.image);

                    if (e.errors.length > 0) {
                        inputTimeoutRef.current.image = setTimeout(() => {
                            setFormErrors((error) => ({
                                ...error,
                                image: e.errors[0],
                            }));
                        }, 1000);
                    } else if (_formErrors.image) {
                        _formErrors = {
                            ..._formErrors,
                            image: '',
                        };
                    }
                    break;
            }
        });
        setFormErrors(_formErrors);
    }
    const propsUpLoad: UploadProps = {
        name: 'file',
        multiple: false,
        onChange(info) {
            const {status} = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                setUploadDisabled(true); // Vô hiệu hóa tải lên thêm
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
        disabled: uploadDisabled
    };
    const [locationObtained, setLocationObtained] = useState(false);
    const handleView = () => {
        const success = (pos: { coords: any; }) => {
            const crd = pos.coords;
            setLatitude(crd.latitude);
            setLongitude(crd.longitude);
            console.log("Your current position is:");
            console.log(`Latitude : ${crd.latitude}`);
            console.log(`Longitude: ${crd.longitude}`);
            console.log(`More or less ${crd.accuracy} meters.`);
            // Update the loading message to success
            form.setFieldsValue({
                lat: crd.latitude,
                lng: crd.longitude
            });
            setLocationObtained(true);
            messageApi.success(t('Loading Success')).then();
        };

        const errors = (err: { code: any; message: any; }) => {
            console.warn(`ERROR(${err.code}): ${err.message}`);
            // Handle error and update the loading message accordingly
            messageApi.error('Loading Error').then();
        };

        // Show loading message only if location hasn't been obtained yet
        if (!locationObtained) {
            if (navigator.geolocation) {
                navigator.permissions.query({ name: "geolocation" }).then(async function (result) {
                    console.log(result);
                    if (result.state === "granted") {
                        navigator.geolocation.getCurrentPosition(success, errors, options);
                    } else if (result.state === "prompt") {
                        navigator.geolocation.getCurrentPosition(success, errors, options);
                    } else if (result.state === "denied") {
                        messageApi.error(t('location Permission Denied')).then();
                    }
                });
            } else {
                // Geolocation is not supported by this browser
                console.log("Geolocation is not supported by this browser.");
                messageApi.error(t('message.locationNotSupported')).then();
            }
        }
    };


    useEffect(() => {
        console.log('MOUNT: Diary Widget Screen');
        // Gọi hàm dispatchGetActivity khi component được mount lại
        if (props.id !== undefined) { // Kiểm tra xem props.id có được định nghĩa hay không
            const foundDetail = vmDiaryList.items.find((detail) => detail.diaryId === props.id);
            setDiary(foundDetail)
            // form.setFieldsValue({
            //     name: foundDetail?.name || "",
            //     description: foundDetail?.description,
            // });
            if (foundDetail?.location !== undefined) {
                const locationArray = foundDetail?.location.split(',');
                const lat: number = parseFloat(locationArray[0]);
                const long: number = parseFloat(locationArray[1]);
                setLatitude(lat)
                setLongitude(long)
            }
        }
        return () => {
            console.log('UNMOUNT: Diary Widget Screen');
            form.resetFields()
            setLatitude(null)
            setLongitude(null)

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.id]);
    useEffect(() => {
        if (vmForm.isLoading === E_SendingStatus.success) {
            messageApi.success(t('message.saveSuccess')).then()
            if (props.onClose) {
                props.onClose()
            }
            form.resetFields()
        } else if (vmForm.isLoading === E_SendingStatus.error && vmForm.error) {
            messageApi.error(t('message.saveError')).then()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vmForm]);

    const onCloseWidget = () => {
        if (props.onClose) {
            props.onClose()
            form.resetFields()
            setUploadDisabled(false)
            setFile(undefined)
        }
    }
    const onFinish = async (values: any) => {
        console.log("onFinish:", values);
        if (props.method === false) {
            const data: T_FormEditDiary = {
                ...values,
                _method: 'PUT',
                lat: latitude,
                lng: longitude,
                image: file
            }
            console.log("onFinish:", data);
            dispatchEditDiary(diary?.diaryId, data)
        } else {
            const data: T_FormAddDiary = {
               ...values,
                location:`${latitude},${longitude}`,
                image:file
            }
            console.log("onFinish:", data);
            dispatchAddDiary(data)
        }
    }
    const onFinishFailed = (errorInfo: any) => {
        console.log("onFinishFailed:", errorInfo);
        let _formErrors = formErrors;
        errorInfo.errorFields.forEach((e: { name: any[]; errors: any[]; }) => {
            _formErrors = {
                ..._formErrors,
                [e.name[0]]: e.errors[0],
            };
        });
        setFormErrors(_formErrors);
    };
    return (
        <>
            {contextHolder}
            <ConfigProvider>
                <Modal
                    forceRender={false}
                    centered
                    open={props.isOpen}
                    width={600}
                    closable={false}
                    className={"relative"}
                    zIndex={1000}
                    footer={null} // Loại bỏ phần footer mặc định
                >
                    <div style={{textAlign: "center", fontWeight: "bold", fontSize: "24px"}}>
                        <p>{props.method ?
                            (t('text.add')
                            ) : (
                                t('text.editDiary'))
                        }</p>
                    </div>
                    <Divider/>
                    <div style={{display: "flex", justifyContent: "space-evenly"}}>
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
                                validateStatus={Utils.viewStatusError<_T_FormError>(formErrors, 'description')}
                                help={Utils.viewHelpError<_T_FormError>(formErrors, 'description')}
                            >
                                <Input.TextArea maxLength={400} style={{minHeight: 160}}/>
                            </Form.Item>
                            {props.method ? (
                                <Form.Item label={t('text.address')} style={{marginBottom: 0}}>
                                    <Form.Item
                                        name="lat"
                                        rules={[{required: true}]}
                                        style={{display: 'inline-block', width: 'calc(33% - 8px)'}}
                                    >
                                        <Input placeholder={t('text.lat')}/>
                                    </Form.Item>
                                    <Form.Item
                                        name="lng"
                                        rules={[{required: true}]}
                                        style={{display: 'inline-block', width: 'calc(33% - 8px)', margin: '0 8px'}}
                                    >
                                        <Input placeholder={t('text.lng')}/>
                                    </Form.Item>
                                    <Form.Item
                                        style={{display: 'inline-block', width: 'calc(33% - 8px)'}}
                                    >
                                        <Button type="primary" style={{color:"white"}}
                                        onClick={handleView}
                                        >{t('button.getCurrLocation')}
                                        </Button>
                                    </Form.Item>
                                </Form.Item>
                            ) : null}
                            <Form.Item
                                label={t('text.image')}
                                name="image"
                                validateStatus={Utils.viewStatusError<_T_FormError>(formErrors, 'image')}
                                help={Utils.viewHelpError<_T_FormError>(formErrors, 'image')}
                            >
                                <Dragger {...propsUpLoad}
                                         beforeUpload={file => setFile(file)}>
                                    <p className="ant-upload-drag-icon">
                                        <InboxOutlined/>
                                    </p>
                                    <p className="ant-upload-text">{t('message.uploadFile')}</p>
                                </Dragger>
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
            </ConfigProvider>
        </>
    )
}