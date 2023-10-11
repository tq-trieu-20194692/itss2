import * as React from 'react';
import {FC, useEffect, useState} from 'react';
import ReactMapGL, {Marker} from '@goongmaps/goong-map-react';
import axios from "axios";
import {UrlQuery} from "../../core/UrlQuery";
import {debounce} from "lodash";
import {App} from "../../const/App";
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
    location?: string
    callback?: Function
    onClose?: Function
}

export const LocationWidget: FC<T_MapProps> = props => {
    const [viewport, setViewport] = useState({
        width: 400,
        height: 300,
        latitude: 21.031673076538056,
        longitude: 105.84038426747847,
        zoom: 14
    })
    const [urlQueryParams, setUrlQueryParams] = useState({
        api_key: Map.ApiKeyMap,
        input: props.location
    })

    const [selected, setSelected] = useState({
        api_key: Map.ApiKeyMap,
        place_id: ''
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
        if (!props.isOpen) {
            setViewport({
                ...viewport,
                latitude: 21.031673076538056,
                longitude: 105.84038426747847
            })
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.isOpen])

    useEffect(() => {
        if (props.isOpen) {
            setAddress({
                name: '',
                lat: viewport.latitude,
                lng: viewport.longitude
            })
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.isOpen])
    debounce((value: string) => {
        if (value.length > 0) {
            setUrlQueryParams({
                ...urlQueryParams,
                input: value
            })
        }
    }, App.DelaySearch);
    useEffect(() => {
        if (urlQueryParams.input !== '') {
            const urlQuery = new UrlQuery(urlQueryParams)

            axios
                .get(`https://rsapi.goong.io/Place/AutoComplete${urlQuery.toString()}`)
                .then(r => {
                    if (r.data) {
                        if (r.data.predictions) {
                            setSelected({
                                ...selected,
                                place_id: r.data.predictions[0].place_id
                            })

                        } else {
                           setSelected({
                               ...selected,
                               place_id: ''
                           })
                        }
                    }
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [urlQueryParams])

    useEffect(() => {
        if (selected.place_id !== '') {
            const urlQuery = new UrlQuery(selected)
            console.log(urlQuery)
            axios
                .get(`https://rsapi.goong.io/Place/Detail${urlQuery.toString()}`)
                .then(r => {
                    if (r.data.result.geometry.location) {
                        console.log(r)
                        setViewport({
                            ...viewport,
                            latitude: r.data.result.geometry.location.lat,
                            longitude: r.data.result.geometry.location.lng
                        })
                        setAddress({
                            name: r.data.result.formatted_address,
                            lat: r.data.result.geometry.location.lat,
                            lng: r.data.result.geometry.location.lng
                        })
                    }
                })

        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected])

    const changeCoordinate = (coordinate: number[]) => {
        setAddress({
            ...address,
            lng: coordinate[0],
            lat: coordinate[1]
        })
    }

    return (

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

    )
}
