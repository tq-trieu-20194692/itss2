import React, {useEffect, useState} from "react";
import {Button, List, Pagination, Popover, Typography} from 'antd';
import {ClockCircleOutlined, EllipsisOutlined} from '@ant-design/icons';
import {useNavigate} from "react-router";
import {UrlQuery} from "../../../../core/UrlQuery";
import {ActivityLogModel, T_QueryVO} from "../../../../models/UserModel";
import {getImageForPlatForm} from "../../../../const/Img";
import {AccountActivityWidget, T_AccountActivityWidgetProps} from "./UserActivityLogWidget";
import Function from "../../../../const/Function";
import {useTranslation} from "react-i18next";
import {UserActivityLogAction} from "../../../../recoil/user/ActivityLog/UserActivityLogAction";


const UserActivityLogScreen = () => {
    const {
        vm: vmActivity,
        dispatchGetActivity
    } = UserActivityLogAction()
    const {
        ActivityText,
        setUpDate
    } = Function()
    const {t} = useTranslation();
    const navigate = useNavigate()
    const [accountActivity, setAccountActivity] = useState<ActivityLogModel[]>([])
    const [accountActivityWidget, setAccountActivityWidget] = useState<T_AccountActivityWidgetProps>({
        isOpen: false
    })
    const onCloseWidget = () => {
        setAccountActivityWidget({
            isOpen: false
        })
    }

    const URL = new UrlQuery(location.search)
    const page = URL.getInt("page", vmActivity.query.page)
    // console.log(vmActivity.query.page)
    const limit = URL.getInt("limit", vmActivity.query.limit)
    const [queryParams, setQueryParams] = useState<T_QueryVO>({
        page: page,
        limit: limit,
    })
    let currentDate: string | null = null;
    let groupedItems: any[] = [];

    const groupedHistory = accountActivity.reduce((result: { [key: string]: any[] }, item) => {
        const timestamp = item.createdAt;
        const date = timestamp ? new Date(timestamp).toISOString().split('T')[0] : null;
        if (date !== currentDate) {
            if (groupedItems.length > 0) {
                result[currentDate!] = groupedItems;
            }
            currentDate = date;
            groupedItems = [item];
        } else {
            groupedItems.push(item);
        }
        return result;
    }, {} as { [key: string]: any[] });

    if (groupedItems.length > 0) {
        groupedHistory[currentDate!] = groupedItems;
    }

    const handleViewDetail = (id: string,refId?:string) => {
        setAccountActivityWidget({
            isOpen: true,
            ActivityId: id,
            Refit:refId

        })
    }
    useEffect(() => {
        console.log('MOUNT: Account Activity Screen');
        // Gọi hàm dispatchGetActivity khi component được mount lại
        dispatchGetActivity(new UrlQuery(queryParams).toObject());
        return () => {
            console.log('UNMOUNT: Account Activity Screen');

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        console.log('vm.isLoading', vmActivity.isLoading)
    }, [vmActivity.isLoading])

    useEffect(() => {
        console.log('vm.items', vmActivity.items)
        setAccountActivity(vmActivity.items)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vmActivity.items])

    useEffect(() => {
        console.log('vm.error', vmActivity.error)
    }, [vmActivity.error])

    const urlQueryParams = new UrlQuery(queryParams)
    const paginationOptions = {
        pageSize: vmActivity.oMeta?.perPage || 10,
        current: vmActivity.oMeta?.currentPage,
        total: vmActivity.oMeta?.totalCount,
        onChange: (page: number) => {
            urlQueryParams.set("page", page)
            dispatchGetActivity(urlQueryParams.toObject())
            setQueryParams(urlQueryParams.toObject())
            navigate({
                search: urlQueryParams.toString()
            }, {
                replace: true
            })
        }
    }

    return (
        <>
            <h1>{t('text.activityLog')}</h1>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    width: '100%',
                    position: 'relative', // Thêm thuộc tính position
                }}
            >
                {Object.entries(groupedHistory).map(([date, items],index) => (
                    <div
                        key={`${date}-${index}`}
                        style={{
                            border: '2px solid #ddd',
                            borderRadius: '5px',
                            margin: '2% 2% auto',
                            width: '96%',
                            backgroundColor: '#f9f9f9',
                            position: 'relative',
                        }}
                    >
                        <h3 style={{display: 'flex', justifyContent: 'flex-start', marginLeft: '15px', marginTop: '5px'}}>{date}</h3>
                        <List
                            dataSource={items} // Use 'items' instead of 'Object.entries(groupedHistory)'
                            renderItem={(item,index) => (
                                <List.Item style={{ padding: 0, paddingRight: '2%', marginBottom: '2%' }}  key={`${item.id}-${index}`}>
                                    <div
                                        key={`${item.id}-${index}`}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            margin: '10px 0',
                                        }}

                                    >
                                        <div style={{flex: 1}}>
                                            <div style={{display: 'flex', alignItems: 'center'}}>
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={getImageForPlatForm(item.userAgent?.platForm)}
                                                    alt="Activity"
                                                    style={{
                                                        width: '50px',
                                                        height: '50px',
                                                        marginRight: '40px',
                                                        marginLeft: '40px'
                                                    }}
                                                />
                                                <div style={{flex: 1, textAlign: 'left'}}>
                                                    <p><b>{ActivityText(item.key)} {item.userAgent ===undefined ? t('text.unknownDevice')  : ""}  </b></p>
                                                    {/*<p>Device: {item.activity?.userAgent?.name}</p>*/}
                                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                                        <ClockCircleOutlined style={{marginRight: '8px'}}/>
                                                        <Typography.Text>{setUpDate(item.createdAt)}</Typography.Text>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{position: 'absolute', right: 0}} >
                                            <Popover
                                                placement="bottomRight"
                                                content={
                                                    <div style={{display: 'flex', flexDirection: 'column'}}>
                                                        <Button onClick={() => handleViewDetail(item.id,item.refId)} type="text">{t('text.view')}</Button>
                                                    </div>
                                                }
                                                trigger="click"
                                            >
                                                <EllipsisOutlined style={{fontSize: '30px', color: 'blue', marginRight: '40px'}}/>
                                            </Popover>
                                        </div>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </div>
                ))}
            </div>
            <AccountActivityWidget
                refId={accountActivityWidget.Refit}
                isOpen={accountActivityWidget.isOpen}
                id={accountActivityWidget.ActivityId}
                onClose={onCloseWidget}
                queryParams={queryParams}
            />
            <Pagination style={{display: 'flex', justifyContent: 'flex-end', marginTop: "10px", marginBottom: '10px'}} {...paginationOptions} />
        </>
    );

}
export default UserActivityLogScreen