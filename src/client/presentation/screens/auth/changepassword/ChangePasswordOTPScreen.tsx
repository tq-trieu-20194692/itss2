import React, {useEffect, useState, useRef} from 'react';
import {useLocation} from 'react-router-dom';
import {Button, Form, Input, Modal, Typography} from 'antd';
import CIcon from '@coreui/icons-react';
import {cilLockLocked, cilUser} from '@coreui/icons';
import {ResetPasswordOTPAction} from '../../../../recoil/account/resetpassword-otp/ResetPasswordOTPAction';
import {E_SendingStatus} from '../../../../const/Events';
import {useNavigate} from 'react-router';
import {FieldData} from 'rc-field-form/lib/interface';
import ErrorItemWidget from "../../../widgets/ErrorItemWidget";
import {Utils} from "../../../../core/Utils";
import {useTranslation} from 'react-i18next';
import {LoginOutlined} from '@ant-design/icons';

type _T_ResetPasswordOTP = {
    email: string;
    newpassword: string;
    confirmpassword: string;
    otp: string;
};

type _T_FormError = {
    [K in keyof _T_ResetPasswordOTP]?: _T_ResetPasswordOTP[K];
};

const ChangePasswordOTP = () => {
    const navigate = useNavigate();
    const {t} = useTranslation();

    const location = useLocation();

    console.log('location', location);

    const {vm, dispatchResetPassword} = ResetPasswordOTPAction();
    const [formErrors, setFormErrors] = useState<_T_FormError>({});

    const inputTimeoutRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

    const isLoading = vm.status === E_SendingStatus.loading;
    const onFieldsChange = (data: FieldData[]) => {
        let _formErrors = formErrors;

        data.forEach((e: any) => {
            switch (e.name[0]) {
                case 'email':
                    if (inputTimeoutRef.current.email) clearTimeout(inputTimeoutRef.current.email);

                    if (e.errors.length > 0) {
                        inputTimeoutRef.current.email = setTimeout(() => {
                            setFormErrors((error) => ({
                                ...error,
                                email: e.errors[0],
                            }));
                        }, 1000);
                    } else if (_formErrors.email) {
                        _formErrors = {
                            ..._formErrors,
                            email: '',
                        };
                    }

                    break;
                case 'newpassword':
                    if (inputTimeoutRef.current.newpassword) clearTimeout(inputTimeoutRef.current.newpassword);

                    if (e.errors.length > 0) {
                        inputTimeoutRef.current.newpassword = setTimeout(() => {
                            setFormErrors((error) => ({
                                ...error,
                                newpassword: e.errors[0],
                            }));
                        }, 1000);
                    } else if (_formErrors.newpassword) {
                        _formErrors = {
                            ..._formErrors,
                            newpassword: '',
                        };
                    }

                    break;
                case 'confirmpassword':
                    if (inputTimeoutRef.current.confirmpassword) clearTimeout(inputTimeoutRef.current.confirmpassword);

                    if (e.errors.length > 0) {
                        inputTimeoutRef.current.confirmpassword = setTimeout(() => {
                            setFormErrors((error) => ({
                                ...error,
                                confirmpassword: e.errors[0],
                            }));
                        }, 1000);
                    } else if (_formErrors.confirmpassword) {
                        _formErrors = {
                            ..._formErrors,
                            confirmpassword: '',
                        };
                    }

                    break;
                case 'otp':
                    if (inputTimeoutRef.current.otp) clearTimeout(inputTimeoutRef.current.otp);

                    if (e.errors.length > 0) {
                        inputTimeoutRef.current.otp = setTimeout(() => {
                            setFormErrors((error) => ({
                                ...error,
                                otp: e.errors[0],
                            }));
                        }, 1000);
                    } else if (_formErrors.otp) {
                        _formErrors = {
                            ..._formErrors,
                            otp: '',
                        };
                    }

                    break;
            }
        });

        setFormErrors(_formErrors);
    };

    const onFinish = (values: _T_ResetPasswordOTP) => {
        const {newpassword, confirmpassword, otp, email} = values;

        if (newpassword === confirmpassword) {
            const resetPasswordData = {
                email: email,
                password: newpassword,
                password_confirmation: confirmpassword,
                otp: otp,
            };

            dispatchResetPassword(resetPasswordData);
        } else {
            setFormErrors({confirmpassword: 'Mật khẩu không khớp'});
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        if (vm.status === E_SendingStatus.success) {
            navigate('/login', {replace: true});
        }
    }, [vm.status, navigate]);

    useEffect(() => {
        if (vm.status === E_SendingStatus.error) {
            setFormErrors({});
        }
    }, [vm.status]);

    useEffect(() => {
        if (vm.error && Object.keys(vm.error).length > 0) {
            let _formErrors = formErrors;

            Object.entries(vm.error).forEach(([key, value]) => {
                _formErrors = {
                    ..._formErrors,
                    [key]: value,
                };
            });

            setFormErrors(_formErrors);
        }

    }, [vm.error]);

    return (
        <div
            className="popup-background"
            style={{
                background: 'rgb(234, 237, 239)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
            }}
        >
            <div
                className="password-change-container"
                style={{
                    background: 'white',
                    padding: '30px',
                    borderRadius: '5px',
                    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
                    width: '500px',
                    height: 'auto', // Set height to auto for dynamic content
                }}
            >
                <ErrorItemWidget status={vm.status} typeView={'modal'}>
                    <Form
                        name="basic"
                        style={{maxWidth: 400, margin: '0 auto'}}
                        initialValues={{remember: true}}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        onFieldsChange={onFieldsChange}
                    >
                        <Typography.Title level={4} className={'mb-0'}>
                            {t('text.email')}
                        </Typography.Title>
                        <Form.Item
                            className={'form-item-main'}
                            key={'email'}
                            name={'email'}
                            rules={[
                                {
                                    required: true,
                                    message: t('error.required', {label: t('text.email').toLowerCase()}),
                                },
                            ]}
                            validateStatus={Utils.viewStatusError<_T_FormError>(formErrors, 'email')}
                            help={Utils.viewHelpError<_T_FormError>(formErrors, 'email')}
                        >
                            <Input.Password
                                style={{textAlign: 'start'}}
                                placeholder={t('text.email')}
                                addonBefore={<CIcon icon={cilUser}/>}
                            />
                        </Form.Item>

                        <Typography.Title level={4} className={'mb-0'}>
                            {t('text.newPassword')}
                        </Typography.Title>
                        <Form.Item
                            className={'form-item-main'}
                            key={'newpassword'}
                            name={'newpassword'}
                            rules={[
                                {
                                    required: true,
                                    message: t('error.required', {label: t('text.newPassword').toLowerCase()}),
                                },
                                {
                                    min: 6,
                                    max: 30,
                                    message: t('error.length', {
                                        label: t('text.newPassword'),
                                        min: 6,
                                        max: 30,
                                    }),
                                },
                            ]}
                            validateStatus={Utils.viewStatusError<_T_FormError>(formErrors, 'newpassword')}
                            help={Utils.viewHelpError<_T_FormError>(formErrors, 'newpassword')}
                        >
                            <Input.Password
                                style={{textAlign: 'start'}}
                                placeholder={t('text.newPassword')}
                                addonBefore={<CIcon icon={cilLockLocked}/>}
                            />
                        </Form.Item>

                        <Typography.Title level={4} className={'mb-0'}>
                            {t('text.confirmPassword')}
                        </Typography.Title>
                        <Form.Item
                            className={'form-item-main'}
                            key={'confirmpassword'}
                            name={'confirmpassword'}
                            rules={[
                                {
                                    required: true,
                                    message: t('error.required', {
                                        label: t('text.confirmPassword').toLowerCase()
                                    }),
                                },
                                {
                                    min: 6,
                                    max: 30,
                                    message: t('error.length', {
                                        label: t('text.confirmPassword'),
                                        min: 6,
                                        max: 30,
                                    }),
                                },
                            ]}
                            validateStatus={Utils.viewStatusError<_T_FormError>(formErrors, 'confirmpassword')}
                            help={Utils.viewHelpError<_T_FormError>(formErrors, 'confirmpassword')}
                        >
                            <Input.Password
                                style={{textAlign: 'start'}}
                                placeholder={t('text.confirmPassword')}
                                addonBefore={<CIcon icon={cilLockLocked}/>}
                            />
                        </Form.Item>

                        <Typography.Title level={4} className={'mb-0'}>
                            {t('text.otp')}
                        </Typography.Title>
                        <Form.Item
                            className={'form-item-main'}
                            key={'otp'}
                            name={'otp'}
                            rules={[
                                {
                                    required: true,
                                    message: t('error.required', {label: t('text.otp').toLowerCase()}),
                                },
                            ]}
                            validateStatus={Utils.viewStatusError<_T_FormError>(formErrors, 'otp')}
                            help={Utils.viewHelpError<_T_FormError>(formErrors, 'otp')}
                        >
                            <Input.Password
                                style={{textAlign: 'start'}}
                                placeholder={t('text.otp')}
                                addonBefore={<CIcon icon={cilLockLocked}/>}
                            />
                        </Form.Item>

                        <Button
                            htmlType={'submit'}
                            type={'primary'}
                            size={'large'}
                            loading={isLoading}
                            icon={<LoginOutlined/>}
                        >
                            {t('text.resetPassword')}
                        </Button>
                    </Form>
                </ErrorItemWidget>
            </div>
            <Modal
                visible={vm.status === E_SendingStatus.success}
                onCancel={() => navigate('/login')}
                footer={[
                    <Button key="back" onClick={() => navigate('/login')}>
                        Quay lại
                    </Button>,
                ]}
            >
                <Typography.Title level={4}>Mật khẩu đã được thay đổi thành công.</Typography.Title>
            </Modal>
        </div>
    );
};

export default ChangePasswordOTP;
