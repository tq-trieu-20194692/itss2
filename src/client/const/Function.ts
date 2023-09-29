export const setIcon = (date: string | undefined) =>{
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
export const setUpDate = (date: string | undefined) => {
    if (date !== undefined) {
        const targetDate = new Date(date);
        const currentDate = new Date();
        const timeDifference = currentDate.getTime() - targetDate.getTime(); // Khoảng thời gian tính bằng mili giây
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        let result = '';
        if(days > 15)
        {
            result += `Không hoạt động trong ${days} ngày trước`;
            return result
        }
        else if (days > 0) {
            result += `${days} ngày`;
        } else {
            const seconds = Math.floor(timeDifference / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);

            if (hours > 0) {
                result += `${hours} giờ`;
            }
            if (minutes > 0 && minutes % 60 !== 0) {
                result += ` ${minutes % 60} phút`;
            }
        }
        if (result === '') {
            result = 'vài giây'; // Nếu không còn thời gian nào thì hiển thị "vài giây"
        }
        return (result + " trước")
    }
}

export  const ActivityText  =(key :string|undefined) =>{
    switch (key) {
        case "admin.user.login":
            return ` Đã Đăng nhập`;
        case "admin.user.logout":
            return `Đã Đăng xuất`;
        case "admin.user.logout.all":
            return `Đã đăng xuất trên tất cả các thiết bị`;
        case "admin.user.edit":
            return `Đã Edit một tài khoản `;
        case "admin.user.logout.far":
            return " Đã đăng xuất từ xa "
        case "admin.user.delete":
            return `Đã xóa một tài khoản `;
        default:
            return `....`;
    }
}