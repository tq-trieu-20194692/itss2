import {Model} from "./Model";
import {Normalize} from "../core/Normalize";

export class DiaryModel extends Model {
    diaryId?: string
    createAt?: string
    userId?: string
    name?: string
    location?: string
    status?: number
    image?: string

    constructor(data: Record<string, any>) {
        super(data)
        this.diaryId = Normalize.initJsonString(data, 'id')
        this.createAt = Normalize.initJsonString(data, 'created_at')
        this.userId = Normalize.initJsonString(data, 'user_id')
        this.location = Normalize.initJsonString(data, 'location')
        this.name = Normalize.initJsonString(data, 'name')
        this.status = Normalize.initJsonNumber(data, 'status')
        this.image = Normalize.initJsonString(data, 'image')
    }
}

class WeatherMainModel extends Model {
    temp?: string
    humidity?: string
    pressure?: string
    tempMax?: string
    tempMin?: string

    constructor(data: Record<string, any>) {
        super(data)
        this.temp = Normalize.initJsonString(data, 'temp')
        this.humidity = Normalize.initJsonString(data, 'humidity')
        this.pressure = Normalize.initJsonString(data, 'pressure')
        this.tempMax = Normalize.initJsonString(data, 'temp_max')
        this.tempMin = Normalize.initJsonString(data, 'temp_min')

    }
}

class WeatherWindModel extends Model {
    speed?: string

    constructor(data: Record<string, any>) {
        super(data)
        this.speed = Normalize.initJsonString(data, 'speed')

    }
}

class PostDiaryAddressModel extends Model {
    display?: string

    constructor(data: Record<string, any>) {
        super(data)
        this.display = Normalize.initJsonString(data, 'display')

    }
}

class Location extends Model {
    lat?: string
    long?: string

    constructor(data: Record<string, any>) {
        super(data)
        this.lat = Normalize.initJsonString(data, 'lat')
        this.long = Normalize.initJsonString(data, 'lon')


    }
}

class WeatherModel extends Model {
    createAt?: string
    main?: WeatherMainModel
    wind?: WeatherWindModel
    location?: Location
    constructor(data: Record<string, any>) {
        super(data)
        this.createAt = Normalize.initJsonString(data, 'dt')
        this.main = Normalize.initJsonObject(data, 'main', v => new WeatherMainModel(v))
        this.wind = Normalize.initJsonObject(data, 'wind', v => new WeatherWindModel(v))
        this.location = Normalize.initJsonObject(data, 'cord', v => new Location(v))
    }
}

export class PostDiaryModel extends Model {
    postDiaryId?: string
    diaryId?: string
    createAt?: string
    userId?: string
    name?: string
    location?: string
    status?: number
    weather?: WeatherModel
    address?: PostDiaryAddressModel

    constructor(data: Record<string, any>) {
        super(data)
        this.postDiaryId = Normalize.initJsonString(data, 'id')
        this.diaryId = Normalize.initJsonString(data, 'diary_id')
        this.createAt = Normalize.initJsonString(data, 'created_at')
        this.userId = Normalize.initJsonString(data, 'user_id')
        this.location = Normalize.initJsonString(data, 'location')
        this.name = Normalize.initJsonString(data, 'name')
        this.status = Normalize.initJsonNumber(data, 'status')
        this.weather = Normalize.initJsonObject(data, 'weather', v => new WeatherModel(v))
        this.address = Normalize.initJsonObject(data, 'address', v => new PostDiaryAddressModel(v))

    }
}