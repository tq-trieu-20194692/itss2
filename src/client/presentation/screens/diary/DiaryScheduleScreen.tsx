import {DiaryPostListAction} from "../../../recoil/diary/diaryPostList/DiaryPostListAction";
import {useEffect} from "react";

const DiaryScheduleScreen =() =>{
    const {
        vm: vmDiaryPost,

    } = DiaryPostListAction()
    useEffect(() => {
        console.log('vm.isLoading', vmDiaryPost.isLoading)
    }, [vmDiaryPost.isLoading])

    useEffect(() => {
        console.log('vm.items', vmDiaryPost.items)
    }, [vmDiaryPost.items])
    return(
        <>
        111
        </>
    )
}
export default DiaryScheduleScreen