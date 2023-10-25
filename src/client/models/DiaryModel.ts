import {Model} from "./Model";
import {Normalize} from "../core/Normalize";
import {AccessTokenModel} from "./UserModel";

export class DiaryModel extends Model {
    diaryId?:string
    constructor(data: Record<string, any>) {
        super(data)
        this.diaryId = Normalize.initJsonString(data, 'diary_id')
    }
}