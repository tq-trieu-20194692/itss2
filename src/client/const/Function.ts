import {useTranslation} from "react-i18next";



const Function = () => {
    const {t} = useTranslation();
    const setIcon = (date: string | undefined) =>{
        if (date !== undefined) {
            const targetDate = new Date(date);
            const currentDate = new Date();
            const timeDifference = currentDate.getTime() - targetDate.getTime(); // Khoảng thời gian tính bằng mili giây
            return Math.floor(timeDifference / (1000 * 60 * 60 * 24))
        }
        else {
            return 0
        }
    }
    const setUpDate = (date: string | undefined) => {
        if (date !== undefined) {
            const targetDate = new Date(date);
            const currentDate = new Date();
            const timeDifference = currentDate.getTime() - targetDate.getTime(); // Khoảng thời gian tính bằng mili giây
            const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            let result = '';
            if(days > 15)
            {
                result += `${t('text.inactiveDays',{label:days})}`;
                return result
            }
            else if (days > 0) {
                result += `${days} ${t('text.day')}`;
            } else {
                const seconds = Math.floor(timeDifference / 1000);
                const minutes = Math.floor(seconds / 60);
                const hours = Math.floor(minutes / 60);

                if (hours > 0) {
                    result += `${hours} ${t('text.hour')}`;
                }
                if (minutes > 0 && minutes % 60 !== 0) {
                    result += ` ${minutes % 60} ${t('text.minute')}`;
                }
            }
            if (result === '') {
                result = `${t('text.seconds')}`;
            }
            return (result + `${t('text.ago')}`)
        }
    }
    const ActivityText  =(key :string|undefined) =>{
        switch (key) {
            case "admin.user.login":
                return t('text.loginSuccess');
            case "admin.user.logout":
                return t('text.logoutSuccess');
            case "admin.user.logout.all":
                return t('text.logoutFar');
            case "admin.edit.user":
                return t('text.editAccount');
            case "admin.user.logout.far":
                return t('text.logoutFar');
            case "admin.delete.user":
                return t('text.deleteAccount');
            case "admin.user.delete":
                return t('text.deleteAdmin');
            case "admin.user.register":
                return t('text.adminRegister');
            default:
                return `None`;
        }
    }
    const StateDetail= (state:number|undefined) =>
    {
        switch (state) {
            case 0:
                return true;
            case 1:
                return true;
            case undefined:
                return false;
            default:
                return `....`;
        }
    }
    const setFlag = (key:number) =>{
        switch (key){
            case 1:
                return 'https://file.vfo.vn/hinh/2013/12/co-viet-nam-2.jpg'
            case 2:
                return 'https://th.bing.com/th/id/OIP.U-h9wYdOSH047roWjY_1TgHaE3?pid=ImgDet&rs=1'
            case 3:
                return 'https://th.bing.com/th/id/OIP.TJhS9Ks-cfxuk8TLTcBWmgHaFQ?w=268&h=190&c=7&r=0&o=5&dpr=1.3&pid=1.7'
        }
    }
    return{
        setIcon,
        setUpDate,
        StateDetail,
        ActivityText,
        setFlag
    }
}
export default Function



