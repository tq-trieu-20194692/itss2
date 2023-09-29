import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Form, Input, Modal, Typography } from 'antd';
import CIcon from '@coreui/icons-react';
import { useTranslation } from 'react-i18next';
import { cilLockLocked } from '@coreui/icons';
import { ResetPasswordAction } from '../../../../recoil/account/resetpassword/ResetPasswordAction';
import { E_SendingStatus } from '../../../../const/Events';
import { useNavigate } from 'react-router';
import moment from "moment";

type _T_Params = {
    token: string;
    email: string;
};

type _T_ResetPassword = {
    newpassword: string;
    confirmpassword: string;
};

const ChangePassword = () => {
    const params = useParams() as _T_Params;
    console.log('Params:', params);
    const navigate = useNavigate();
    const {token, email} = params;
    const { t } = useTranslation();
    const { vm, dispatchResetPassword } = ResetPasswordAction();
    const [passwordMatchError, setPasswordMatchError] = React.useState(false);
    const [passwordUpdated, setPasswordUpdated] = React.useState(false);

    useEffect(() => {
        console.log(moment.unix(1694760982).utc().format('YYYY-MM-DD[T]HH:mm:ss.SSSSSSZ'))
    }, []);

    const onFinish = (values: _T_ResetPassword) => {
        const { newpassword, confirmpassword } = values;

        if (newpassword === confirmpassword) {
            const resetPasswordData = {
                token,
                email,
                password: newpassword,
                password_confirmation: confirmpassword,
            };
            dispatchResetPassword(resetPasswordData);
        } else {
            setPasswordMatchError(true); // Passwords don't match, show the error
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        if (vm.status === E_SendingStatus.success) {
            setPasswordUpdated(true);
        }
    }, [vm.status]);

    const handlePopupClose = () => {
        setPasswordMatchError(false);
        if (passwordUpdated) {
            navigate('/login');
        }
    };

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
                    height: '250px',
                }}
            >
                <Form
                    name="basic"
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
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
                                message: t('error.required', { label: t('text.newPassword').toLowerCase() }),
                            },
                            {
                                min: 6,
                                max: 30,
                                message: t('error.length', { label: t('text.newPassword'), min: 6, max: 30 }),
                            },
                        ]}
                    >
                        <Input.Password
                            style={{ textAlign: 'start' }}
                            placeholder={t('text.newPassword')}
                            addonBefore={<CIcon icon={cilLockLocked} />}
                        />
                    </Form.Item>

                    <div style={{ marginBottom: '20px' }}>{/* Add an empty div with margin to create space */}</div>

                    <Typography.Title level={4} className={'mb-0'}>
                        {t('text.confirmPassword')}
                    </Typography.Title>

                    <Form.Item
                        className={'form-item-main'}
                        key={'confirmpassword'}
                        name={'confirmpassword'}
                        labelCol={{ span: 12 }}
                        rules={[
                            {
                                required: true,
                                message: t('error.required', { label: t('text.confirmPassword').toLowerCase() }),
                            },
                            {
                                min: 6,
                                max: 30,
                                message: t('error.length', { label: t('text.confirmPassword'), min: 6, max: 30 }),
                            },
                        ]}
                    >
                        <Input.Password
                            style={{ textAlign: 'start' }}
                            placeholder={t('text.confirmPassword')}
                            addonBefore={<CIcon icon={cilLockLocked} />}
                        />
                    </Form.Item>

                    {passwordMatchError && (
                        <p style={{ color: 'red', marginBottom: '10px' }}>
                            Mật khẩu đã được sử dụng từ trước. Vui lòng sử dụng mật khẩu khác.
                        </p>
                    )}

                    <Form.Item wrapperCol={{ span: 24 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ width: '100%' }}
                            disabled={passwordUpdated} // Disable the button when passwordUpdated is true
                        >
                            {t('button.sent')}
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            <Modal
                visible={passwordUpdated}
                onCancel={() => {
                    setPasswordUpdated(false);
                    navigate('/login');
                }}
                footer={[
                    <Button
                        key="back"
                        onClick={() => {
                            setPasswordUpdated(false);
                            navigate('/login');
                        }}
                    >
                        Quay lại trang đăng nhập
                    </Button>,
                ]}
            >
                <Typography.Title level={4}>Mật khẩu đã được cập nhật. Vui lòng quay lại trang đăng nhập.</Typography.Title>
            </Modal>
        </div>
    );
};

export default ChangePassword;
