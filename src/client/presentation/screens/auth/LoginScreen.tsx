import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {CCard, CCardBody, CCardGroup, CCol, CContainer, CRow} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {cilLockLocked, cilUser} from '@coreui/icons';
import {Button, Form, Input, Modal, Typography} from 'antd';
import {useTranslation} from 'react-i18next';
import {useSessionContext} from "../../contexts/SessionContext";
import {E_SendingStatus} from '../../../const/Events';
import {LoginAction} from '../../../recoil/auth/login/LoginAction';
import {ForgotPasswordAction} from '../../../recoil/auth/forgotpassword/ForgotPasswordAction';
import {ForgotPasswordOTPAction} from '../../../recoil/auth/forgotpassword-otp/ForgotPasswordOTPAction';
import {Color} from '../../../const/Color';
import {useNavigate} from 'react-router';
import {Navigate, Link} from 'react-router-dom';
import {RouteConfig} from '../../../config/RouteConfig';
import {FieldData, ValidateErrorEntity} from 'rc-field-form/lib/interface';
import {LoginOutlined} from '@ant-design/icons';
import ErrorItemWidget from '../../widgets/ErrorItemWidget';
import {Utils} from '../../../core/Utils';
import backgroundImage from '../../../../client/assets/images/background.jpg';

type _T_FormName = {
    username: string;
    password: string;
};

type _T_FormError = {
    [K in keyof _T_FormName]?: _T_FormName[K];
};

const LoginScreen = () => {
    const navigate = useNavigate();
    const {t} = useTranslation();
    const [session] = useSessionContext();
    const [modalApi, contextHolder] = Modal.useModal();

    const {
        vm,
        dispatchLogIn,
        dispatchResetState
    } = LoginAction();

    const {
        vm: T_ForgotPasswordState,
        dispatchForgotPassword
    } = ForgotPasswordAction();

    const {
        vm: T_ForgotPasswordOTPState,
        dispatchForgotPasswordOTP
    } = ForgotPasswordOTPAction();

    const [formErrors, setFormErrors] = useState<_T_FormError>({});

    const inputTimeoutRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

    const [otpSent, setOtpSent] = useState(false);

    const [forgotPasswordProps, setForgotPasswordProps] = useState({
        isOpen: false,
        username: ''
    })

    const [sentMessageVisible, setSentMessageVisible] = useState(false);

    const [redirectToChangePassword, setRedirectToChangePassword] = useState(false);

    useEffect(() => {
        console.log('%cMount Screen: LoginScreen', Color.ConsoleInfo);

        return () => {
            dispatchResetState();

            console.log('%cUnmount Screen: LoginScreen', Color.ConsoleInfo);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useLayoutEffect(() => {
        if (session.isAuthenticated) {
            navigate(session.redirectPath, {
                replace: true,
            });
        }

    }, [session.isAuthenticated]);

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

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vm.error]);

    useEffect(() => {
        if (redirectToChangePassword) {
            navigate("/change-password-otp");
        }
    }, [redirectToChangePassword]);

    const showForgotPasswordPopup = () => {
        setForgotPasswordProps({
            ...forgotPasswordProps,
            isOpen: true
        })
    };

    const hideForgotPasswordPopup = () => {
        setForgotPasswordProps({
            ...forgotPasswordProps,
            isOpen: false,
            username: ""
        })
    };

    const handleForgotPasswordUsernameChange = (e) => {
        setForgotPasswordProps({
            ...forgotPasswordProps,
            username: e.target.value
        })
    };

    const handleForgotPasswordSubmit = (method: 'link' | 'otp') => {
        if (!forgotPasswordProps.username) {
            // Show an error message if the username is empty
            modalApi.error({
                title: 'Error',
                content: 'Bạn chưa điền tên tài khoản',
            });
            return;
        }
        if (method === 'link') {
            dispatchForgotPassword(forgotPasswordProps.username);
        } else if (method === 'otp') {
            dispatchForgotPasswordOTP(forgotPasswordProps.username);
            setOtpSent(true);
        }
        setForgotPasswordProps({
            ...forgotPasswordProps,
            username: ''
        })
        hideForgotPasswordPopup();
        setSentMessageVisible(true);
    };

    const onFinish = (values: _T_FormName) => {
        dispatchLogIn({
            username: values.username.trim(),
            password: values.password,
        });
    };

    const isLoading = vm.status === E_SendingStatus.loading;

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

    // redirect if logged
    if (session.isAuthenticated) {
        return <Navigate to={RouteConfig.DASHBOARD}/>;
    }

    return (
        <>
            {contextHolder}
            <div
                className="bg-light min-vh-100 d-flex flex-row align-items-center"
                style={{backgroundImage: `url(${backgroundImage})`}}
            >
                <CContainer>
                    <CRow className="justify-content-center">
                        <CCol md={8}>
                            <CCardGroup>
                                <CCard className="p-4">
                                    <CCardBody>
                                        <ErrorItemWidget status={vm.status} typeView={'modal'}>
                                            <div className="text-center">
                                                <Typography.Title level={2} className={'mb-0'}>
                                                    {t('text.login')}
                                                </Typography.Title>
                                                <Typography.Text type={'secondary'}>
                                                    {t('text.loginSubTitle')}
                                                </Typography.Text>
                                            </div>

                                            <Form
                                                className={'mt-3'}
                                                name={'login'}
                                                onFinish={onFinish}
                                                onFinishFailed={onFinishFailed}
                                                onFieldsChange={onFieldsChange}
                                            >
                                                <div className={'flex flex-col gap-2'}>
                                                    <Typography.Title level={4} className={'mb-0'}>
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
                                                        <Input
                                                            placeholder={t('text.username')}
                                                            addonBefore={<CIcon icon={cilUser}/>}
                                                        />
                                                    </Form.Item>
                                                    <Typography.Title level={4} className={'mb-0'}>
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
                                                            addonBefore={<CIcon icon={cilLockLocked}/>}
                                                        />
                                                    </Form.Item>
                                                </div>
                                                <CRow className={'mt-2'}>
                                                    <CCol xs={6}>
                                                        <Button
                                                            htmlType={'submit'}
                                                            type={'primary'}
                                                            size={'large'}
                                                            loading={isLoading}
                                                            icon={<LoginOutlined/>}
                                                        >
                                                            {t('text.login')}
                                                        </Button>
                                                    </CCol>
                                                    <CCol xs={6} className="text-right">
                                                        <Button type="link" onClick={showForgotPasswordPopup}>
                                                            {t('text.forgotPassword')}
                                                        </Button>
                                                    </CCol>
                                                    <CCol xs={12} className="text-center">
                                                            <span style={{marginLeft: '8px'}}>
                                                                    Thành viên mới? <Link to="/register"
                                                                                          style={{
                                                                                              color: 'green',
                                                                                              textDecoration: 'underline'
                                                                                          }}>{t('text.register')}</Link> tại đây
                                                            </span>
                                                    </CCol>
                                                </CRow>
                                            </Form>
                                        </ErrorItemWidget>
                                    </CCardBody>
                                </CCard>
                            </CCardGroup>
                        </CCol>
                    </CRow>
                </CContainer>
                <Modal
                    title={<div style={{textAlign: 'center'}}>{t('text.forgotPassword')}</div>}
                    open={forgotPasswordProps.isOpen}
                    onCancel={hideForgotPasswordPopup}
                    footer={[
                        <Button key="back" onClick={hideForgotPasswordPopup}>
                            Cancel
                        </Button>,
                        <Button
                            key="submitOTP"
                            type="primary"
                            loading={isLoading}
                            onClick={() => {
                                handleForgotPasswordSubmit("otp");
                            }}
                        >
                            Sent OTP
                        </Button>,
                        <Button
                            key="submitLink"
                            type="primary"
                            loading={isLoading}
                            onClick={() => {
                                handleForgotPasswordSubmit("link");
                            }}
                        >
                            Sent Link
                        </Button>,
                    ]}
                >
                    <Form
                        fields={[
                            {
                                name: "forgotUsername",
                                value: forgotPasswordProps.username
                            }
                        ]}
                    >
                        <Form.Item
                            name="forgotUsername"
                            rules={[
                                {
                                    required: true,
                                    message: t('error.required', {
                                        label: t('text.username').toLowerCase(),
                                    }),
                                },
                            ]}
                        >
                            <Input
                                placeholder={t('text.username')}
                                onChange={handleForgotPasswordUsernameChange}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    title="Thông báo"
                    open={sentMessageVisible}
                    onCancel={() => setSentMessageVisible(false)}
                    footer={[
                        <Button key="back" onClick={() => setSentMessageVisible(false)}>
                            Quay lại
                        </Button>,
                    ]}
                >
                    <p>Đã gửi tin nhắn đến gmail của bạn</p>
                </Modal>
                <Modal
                    title="Thông báo"
                    open={otpSent}
                    onCancel={() => setOtpSent(false)}
                    footer={[
                        <Button key="back" onClick={() => setOtpSent(false)}>
                            Quay lại
                        </Button>,
                        <Button
                            key="next"
                            type="primary"
                            onClick={() => setRedirectToChangePassword(true)}
                        >
                            Tiếp theo
                        </Button>,
                    ]}
                >
                    <p>Đã gửi mã OTP đến gmail của bạn</p>
                </Modal>
            </div>
        </>
    );
};

export default LoginScreen;

