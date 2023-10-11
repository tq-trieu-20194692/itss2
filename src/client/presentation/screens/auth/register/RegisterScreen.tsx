import React, {useEffect, useRef, useState} from 'react';
import {Form, Input, Button, Typography, Select, Modal, Upload, Alert, Divider, DatePicker} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import type {UploadFile} from 'antd/es/upload/interface';
import type {RcFile, UploadProps} from 'antd/es/upload';
import {useTranslation} from 'react-i18next';
import {Utils} from '../../../../core/Utils';
import {RegisterAction} from '../../../../recoil/account/register/RegisterAction';
import {Color} from '../../../../const/Color';
import {FieldData, ValidateErrorEntity} from 'rc-field-form/lib/interface';
import {Link} from "react-router-dom";
import {useNavigate} from "react-router";
import dayjs from "dayjs";
import {T_RegisterVO} from "../../../../models/UserModel";
import {E_SendingStatus} from "../../../../const/Events";

type _T_FormName = {
    username: string
    password: string
    confirm: string
    email: string
    name: string
    address: string
    phone: string
    countryCode: string
    image: File
    DoB: dayjs.Dayjs | null
};

type _T_FormError = {
    [K in keyof _T_FormName]?: _T_FormName[K];
};

const RegisterScreen: React.FC = () => {
    const {vm, dispatchRegister, dispatchResetState} = RegisterAction();
    const navigate = useNavigate();
    const {t} = useTranslation();
    const [formErrors, setFormErrors] = useState<_T_FormError>({});
    const inputTimeoutRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
    const [form] = Form.useForm();
    const [successVisible, setSuccessVisible] = useState(false); // State for success notification
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);
////////-----------------

    useEffect(() => {
        console.log('%cMount Screen: RegisterScreen', Color.ConsoleInfo);

        return () => {
            dispatchResetState();

            console.log('%cUnmount Screen: RegisterScreen', Color.ConsoleInfo);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (vm.error) {
            let _formErrors = formErrors;
            Object.entries(vm.error).forEach(([key, value]) => {
                _formErrors = {
                    ..._formErrors,
                    [key]: value,
                };
            });
            setFormErrors(_formErrors);
        }
    }, [vm.error, formErrors]);


    const onFinish = (values: _T_FormName) => {
        console.log(values)
        const data: T_RegisterVO = {
            username: values.username.trim(),
            password: values.password,
            confirm: values.confirm,
            name: values.name,
            email: values.email,
            phone: values.phone,
            address: values.address,
            image: values.image,
            DoB: values.DoB ? values.DoB.format('YYYY-MM-DD') : ''
        }
        console.log(data)
        dispatchRegister(data)
        if (Object.keys(formErrors).length === 0) {
            setSuccessVisible(true);
            setTimeout(() => {
                setSuccessVisible(false);
                navigate('/login');
            }, 2000);
        }

        console.log('Received values of form: ', values);
    };
    const onFinishFailed = (errorInfo: ValidateErrorEntity) => {
        let _formErrors = formErrors;
        errorInfo.errorFields.forEach((e) => {
            _formErrors = {
                ..._formErrors,
                [e.name[0]]: e.errors[0],
            };
        });
        setFormErrors(_formErrors);
    };

    const onFieldsChange = (data: FieldData[]) => {
        let _formErrors = formErrors;

        data.forEach((e: any) => {
            switch (e.name[0]) {
                case 'username':
                    if (inputTimeoutRef.current.username) clearTimeout(inputTimeoutRef.current.username);

                    if (e.errors.length > 0) {
                        inputTimeoutRef.current.username = setTimeout(() => {
                            setFormErrors((error) => ({
                                ...error,
                                username: e.errors[0],
                            }));
                        }, 1000);
                    } else if (_formErrors.username) {
                        _formErrors = {
                            ..._formErrors,
                            username: '',
                        };
                    }

                    break;
                case 'password':
                    if (inputTimeoutRef.current.password) clearTimeout(inputTimeoutRef.current.password);

                    if (e.errors.length > 0) {
                        inputTimeoutRef.current.password = setTimeout(() => {
                            setFormErrors((error) => ({
                                ...error,
                                password: e.errors[0],
                            }));
                        }, 1000);
                    } else if (_formErrors.password) {
                        _formErrors = {
                            ..._formErrors,
                            password: '',
                        };
                    }

                    break;
            }
        });

        setFormErrors(_formErrors);
    };

    //Upload image
    const getBase64 = (file: RcFile): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        })

    const handleChange: UploadProps['onChange'] = ({fileList: newFileList}) => {
        // Keep only the last uploaded file
        const lastFile = newFileList.slice(-1);
        setFileList(lastFile);
    };

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };

    const uploadButton = (
        <div>
            <PlusOutlined/>
            <div style={{marginTop: 8}}>Upload</div>
        </div>
    );

    return (
        <div
            className="popup-background"
            style={{
                background: 'rgb(234, 237, 239)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '80vh',
            }}>
            <div
                className="password-change-container"
                style={{
                    background: 'white',
                    padding: '30px',
                    borderRadius: '5px',
                    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
                    width: '500px',
                    overflow: 'auto',
                    maxHeight: '100vh',
                }}
            >
                {successVisible && (
                    <>
                        <Alert
                            message="Registered successfully"
                            type="success"
                            showIcon
                            closable
                            style={{marginBottom: 20}}
                            onClose={() => setSuccessVisible(false)}
                        />
                        <Link to="/login"
                              style={{
                                  color: 'green',
                                  textDecoration: 'underline'
                              }}>
                            {t('button.comeBack')}
                        </Link>
                    </>
                )}
                <div className="text-center">
                    <Typography.Title level={2} className={'mb-0'}>
                        {t('text.register')}
                    </Typography.Title>
                    <Typography.Text type={'secondary'}>
                        {t('text.registerSubTitle')}
                    </Typography.Text>
                </div>
                <Divider
                    style={{
                        margin: '20px 0',
                        backgroundColor: 'rgb(3, 155, 145)'
                    }}/>
                <div style={{overflowY: 'auto', maxHeight: 'calc(80vh - 280px)'}}>
                    <Form
                        form={form}
                        name="register"
                        style={{maxWidth: 600}}
                        initialValues={{remember: true}}
                        autoComplete="off"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        onFieldsChange={onFieldsChange}
                    >
                        <div className={'flex flex-col gap-2'}>
                            <Typography.Title level={5} className={'mb-0'}>
                                {t('text.username')}
                            </Typography.Title>
                            <Form.Item
                                key={'username'}
                                name={'username'}
                                rules={[
                                    {
                                        required: true,
                                        whitespace: true,
                                        message: t('error.required', {
                                            label: t('text.username').toLowerCase(),
                                        }),
                                    },
                                    {
                                        min: 3,
                                        max: 30,
                                        message: t('error.length', {
                                            label: t('text.username'),
                                            min: 3,
                                            max: 30,
                                        }),
                                    },
                                ]}
                                validateStatus={Utils.viewStatusError<_T_FormError>(formErrors, 'username')}
                                help={Utils.viewHelpError<_T_FormError>(formErrors, 'username')}
                            >
                                <Input placeholder={t('text.username')}/>
                            </Form.Item>
                            <Typography.Title level={5} className={'mb-0'}>
                                {t('text.password')}
                            </Typography.Title>
                            <Form.Item
                                className={'form-item-main'}
                                key={'password'}
                                name={'password'}
                                rules={[
                                    {
                                        required: true,
                                        message: t('error.required', {
                                            label: t('text.password').toLowerCase(),
                                        }),
                                    },
                                    {
                                        min: 6,
                                        max: 30,
                                        message: t('error.length', {
                                            label: t('text.password'),
                                            min: 6,
                                            max: 30,
                                        }),
                                    },
                                ]}
                                validateStatus={Utils.viewStatusError<_T_FormError>(formErrors, 'password')}
                                help={Utils.viewHelpError<_T_FormError>(formErrors, 'password')}
                            >
                                <Input.Password
                                    style={{
                                        textAlign: 'start',
                                    }}
                                    placeholder={t('text.password')}
                                />
                            </Form.Item>
                            <Typography.Title level={5} className={'mb-0'}>
                                {t('text.confirmPassword')}
                            </Typography.Title>
                            <Form.Item
                                className={'form-item-main'}
                                key={'confirm'}
                                name={'confirm'}
                                dependencies={['password']}
                                rules={[
                                    {
                                        required: true,
                                        message: t('error.required',
                                            {
                                                label: t('text.confirmPassword').toLowerCase(),
                                            }),
                                    },
                                    ({getFieldValue}) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Password confirmation does not match'));
                                        },
                                    }),
                                ]}
                                validateStatus={Utils.viewStatusError<_T_FormError>(formErrors, 'confirm')}
                                help={Utils.viewHelpError<_T_FormError>(formErrors, 'confirm')}
                            >
                                <Input.Password
                                    style={{
                                        textAlign: 'start',
                                    }}
                                    placeholder={t('text.confirmPassword')}
                                />
                            </Form.Item>
                            <Typography.Title level={5} className={'mb-0'}>
                                {t('text.fullname')}
                            </Typography.Title>
                            <Form.Item
                                className={'form-item-main'}
                                key={'name'}
                                name={'name'}
                                rules={[
                                    {
                                        required: true,
                                        message: t('error.required', {
                                            label: t('text.fullname').toLowerCase(),
                                        }),
                                    },
                                    {
                                        min: 6,
                                        max: 30,
                                        message: t('error.length', {
                                            label: t('text.fullname'),
                                            min: 6,
                                            max: 30,
                                        }),
                                    },
                                ]}
                                validateStatus={Utils.viewStatusError<_T_FormError>(formErrors, 'name')}
                                help={Utils.viewHelpError<_T_FormError>(formErrors, 'name')}
                            >
                                <Input placeholder={t('text.fullname')}/>
                            </Form.Item>
                            <Typography.Title level={5} className={'mb-0'}>
                                {t('text.birthdate')} (YYYY-MM-DD)
                            </Typography.Title>
                            <Form.Item
                                className={'form-item-main'}
                                key={'birthdate'}
                                name={'DoB'}
                                rules={[
                                    {
                                        required: true,
                                        message: t('error.required', {
                                            label: t('text.birthdate').toLowerCase(),
                                        }),
                                    },
                                ]}
                                validateStatus={Utils.viewStatusError<_T_FormError>(formErrors, 'birthdate')}
                                help={Utils.viewHelpError<_T_FormError>(formErrors, 'birthdate')}
                            >
                                <DatePicker
                                    style={{width: '100%'}}
                                    placeholder={t('text.birthdate')}
                                    // value={selectedBirthdate}
                                    // onChange={(date) => setSelectedBirthdate(date as Moment | null)}
                                />
                            </Form.Item>
                            <Typography.Title level={5} className={'mb-0'}>
                                {t('text.email')}
                            </Typography.Title>
                            <Form.Item
                                className={'form-item-main'}
                                key={'email'}
                                name={'email'}
                                rules={[
                                    {
                                        required: true,
                                        message: t('error.required', {
                                            label: t('text.email').toLowerCase(),
                                        }),
                                    },
                                    {
                                        type: 'email',
                                        message: t('error.emailFormat'),
                                    },
                                ]}
                                validateStatus={Utils.viewStatusError<_T_FormError>(formErrors, 'email')}
                                help={Utils.viewHelpError<_T_FormError>(formErrors, 'email')}
                            >
                                <Input placeholder={t('text.email')}/>
                            </Form.Item>
                            <Typography.Title level={5} className={'mb-0'}>
                                {t('text.address')}
                            </Typography.Title>
                            <Form.Item
                                className={'form-item-main'}
                                key={'address'}
                                name={'address'}
                                rules={[
                                    {
                                        required: true,
                                        message: t('error.required', {
                                            label: t('text.address').toLowerCase(),
                                        }),
                                    },
                                    {
                                        min: 6,
                                        max: 100,
                                        message: t('error.length', {
                                            label: t('text.address'),
                                            min: 6,
                                            max: 100,
                                        }),
                                    },
                                ]}
                                validateStatus={Utils.viewStatusError<_T_FormError>(formErrors, 'address')}
                                help={Utils.viewHelpError<_T_FormError>(formErrors, 'address')}
                            >
                                <Input placeholder={t('text.address')}/>
                            </Form.Item>
                            <Typography.Title level={5} className={'mb-0'}>
                                {t('text.phone')}
                            </Typography.Title>
                            <Form.Item
                                className={'form-item-main'}
                                key={'phone'}
                                name={'phone'}
                                rules={[
                                    {
                                        required: true,
                                        message: t('error.required', {
                                            label: t('text.phone').toLowerCase(),
                                        }),
                                    },
                                    {
                                        pattern: /^[0-9]{1,10}$/,
                                        message: t('error.phoneFormat'),
                                    },
                                ]}
                                validateStatus={Utils.viewStatusError<_T_FormError>(formErrors, 'phone')}
                                help={Utils.viewHelpError<_T_FormError>(formErrors, 'phone')}
                            >
                                <Input addonBefore={
                                    <Select
                                        defaultValue="+84"
                                        style={{width: 80}}
                                        onChange={(value) => {
                                            // Set the selected country code to the form field
                                            form.setFieldsValue({countryCode: value});
                                        }}
                                    >
                                        <Select.Option value="+84">+84 (Vietnam)</Select.Option>
                                        <Select.Option value="+44">+44 (UK)</Select.Option>
                                        <Select.Option value="+86">+86 (China)</Select.Option>
                                        {/* Add more options as needed */}
                                    </Select>
                                }/>
                            </Form.Item>
                            <Typography.Title level={5} className={'mb-0'}>
                                {t('text.image')}
                            </Typography.Title>
                            <Upload
                                listType="picture-circle"
                                fileList={fileList}
                                onPreview={handlePreview}
                                onChange={handleChange}
                            >
                                {fileList.length >= 1 ? null : uploadButton}
                            </Upload>
                        </div>
                    </Form>
                </div>
                <Divider
                    style={{
                        margin: '20px 0',
                        backgroundColor: 'rgb(3, 155, 145)',
                    }}
                />
                <div className="text-center">
                    <Button type="primary" htmlType="submit" onClick={() => form.submit()}>
                        {t('text.register')}
                    </Button>
                </div>
                <div className="text-center">
                    <span style={{marginLeft: '8px'}}>
                        Bạn đã có tài khoản?{' '}
                        <Link to="/login"
                              style={{
                                  color: 'green',
                                  textDecoration: 'underline',
                              }}
                        >
                            {t('button.comeBack')}</Link>{' '}trang chủ
                    </span>
                </div>
                <Modal
                    open={previewOpen}
                    title={previewTitle}
                    footer={null}
                    onCancel={handleCancel}>
                    <img
                        alt="example"
                        style={{width: '100%'}}
                        src={previewImage}/>
                </Modal>
            </div>
        </div>
    )
}

export default RegisterScreen;
