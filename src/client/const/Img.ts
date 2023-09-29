type _TImg = {
    data: any,
    atl: string,
}

export class Img {
    static readonly Window = "https://cdn-icons-png.flaticon.com/512/22/22831.png"
    static readonly Mac = "https://cdn-icons-png.flaticon.com/512/22/22791.png"
    static readonly Iphone  ="https://cdn-icons-png.flaticon.com/512/1551/1551230.png"
    static readonly Unknown  ="https://cdn-icons-png.flaticon.com/512/10448/10448430.png"
}
 export const getImageForPlatForm = (PlatForm: string | undefined) => {
    switch (PlatForm) {
        case "Windows":
            return `${Img.Window}`;
        case "OS X":
            return `${Img.Mac}`;
        case "AndroidOS":
            return `${Img.Iphone}`;
        case "Unknown":
            return `${Img.Unknown}`;
        default:
            return `${Img.Unknown}`;
    }
}
