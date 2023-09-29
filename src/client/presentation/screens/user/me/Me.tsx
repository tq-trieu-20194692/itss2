import React, { useEffect } from "react";
import { MeAction } from "../../../../recoil/account/me/MeAction";

type _T_MeInfo = {
    id: string
    username: string
    address: string;
    email: string;
    name: string;
    phone: string;
    image: string;
};

const MeScreen = () => {
    const {
        vm,
        dispatchLoadMe,
        dispatchUpdateMeImage,
        dispatchClearUser,
    } = MeAction();

    useEffect(() => {
        dispatchLoadMe();
    }, []);

    const handleUpdateImage = () => {
        // Example: Update the image using dispatchUpdateMeImage
        const imageData = { image: "new-image-url" };
        dispatchUpdateMeImage(imageData);
    };

    const handleClearUser = () => {
        dispatchClearUser();
    };

    return (
        <div>
            <h1>User Information</h1>
            {vm.user && (
                <div>
                    <p>Username: {vm.user.username}</p>
                    <p>Address: {vm.user.address}</p>
                    <p>Email: {vm.user.email}</p>
                    <p>Name: {vm.user.name}</p>
                    <p>Phone: {vm.user.phone}</p>
                    <img src={vm.user.image} alt="User Avatar" />
                </div>
            )}

            <button onClick={handleUpdateImage}>Update Image</button>
            <button onClick={handleClearUser}>Clear User</button>
        </div>
    );
};

export default MeScreen;
