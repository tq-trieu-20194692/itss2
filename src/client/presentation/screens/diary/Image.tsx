import { ImageGrid } from "react-fb-image-video-grid";

const ImageSS = ({ count, images }) => {
    const pic = (c, i) => (
        <img style={{ objectFit: "cover" }} src={c} alt={i}  />
    );

    return (
        <>
            <ImageGrid>
                {images
                    .filter((arg, i) => (i + 1 <= count ? true : false))
                    .map((a, i) => pic(a, i))}
            </ImageGrid>
        </>
    );
};

export default ImageSS;
