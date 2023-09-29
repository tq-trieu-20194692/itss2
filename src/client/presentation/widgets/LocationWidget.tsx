    import * as React from 'react';
    import {FC, useEffect, useState} from 'react';
    import ReactMapGL, {Marker} from '@goongmaps/goong-map-react';
    import {EnvironmentTwoTone} from "@ant-design/icons";
    import {Map} from "../../const/Map";
    import {Color} from "../../const/Color";

    export type T_AddressType = {
        name: string
        lat: number
        lng: number
    }

    export type T_MapProps = {
        isOpen: boolean
        coordinate?: [number | undefined, number | undefined]
        callback?: Function
        onClose?: Function

    }

    export const LocationWidget: FC<T_MapProps> = props => {
        const [viewport, setViewport] = useState({
            width: 400,
            height: 300,
            latitude: props.coordinate && props.coordinate[0] !== undefined ? props.coordinate[0] : 21.00460,
            longitude: props.coordinate && props.coordinate[1] !== undefined ? props.coordinate[1] : 105.85054,
            zoom: 14
        })
        const [urlQueryParams, setUrlQueryParams] = useState({
            api_key: Map.ApiKeyMap,
            input: ''
        })
        const [address, setAddress] = useState<T_AddressType>({
            name: '',
            lat: viewport.latitude,
            lng: viewport.longitude
        })

        useEffect(() => {
            console.log('%cMount Screen: MapWidget', Color.ConsoleInfo)
            return () => {
                console.log('%cUnmount Screen: MapWidget', Color.ConsoleInfo)
            }
        }, [])

        useEffect(() => {
            if (
                props.coordinate
                && (props.coordinate[0] !== undefined && props.coordinate[0] !== 0)
                && (props.coordinate[1] !== undefined && props.coordinate[1] !== 0)
            ) {
                setViewport({
                    ...viewport,
                    latitude: props.coordinate[0],
                    longitude: props.coordinate[1]
                })
            }

            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [props.coordinate])

        useEffect(() => {
            if (props.isOpen) {
                setAddress({
                    name: '',
                    lat: viewport.latitude,
                    lng: viewport.longitude
                })
                if (props.coordinate) {
                    setUrlQueryParams({
                        ...urlQueryParams,
                        input: `${props.coordinate[0]}, ${props.coordinate[1]}` // Định dạng địa chỉ từ coordinate
                    });
                }
            }

            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [props.isOpen])

        const changeCoordinate = (coordinate: number[]) => {
            setAddress({
                ...address,
                lng: coordinate[0],
                lat: coordinate[1]
            })
        }

        return (
           <>
                <ReactMapGL
                    {...viewport}
                    onClick={e => changeCoordinate(e.lngLat)}
                    goongApiAccessToken={Map.AccessKeyMap}
                    onViewportChange={setViewport}
                >
                    <Marker
                        longitude={address.lng}
                        latitude={address.lat}
                        draggable
                        onDragEnd={e => changeCoordinate(e.lngLat)}
                    >
                        <EnvironmentTwoTone className={'text-lg'} twoToneColor={'#FF0000'}/>
                    </Marker>
                </ReactMapGL>

           </>
        )
    }
