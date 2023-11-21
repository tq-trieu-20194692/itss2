import * as React from "react";

let imageElements: Array<HTMLImageElement> = [];

function imageLoadCallback(
    id: string,
    callback: (id: string, width: number, height: number) => void
) {
    return function (this: HTMLImageElement) {
        callback(id, this.naturalWidth, this.naturalHeight);
    };
}

function getImageDimensions(
    src: string,
    id: string,
    cb: (id: string, width: number, height: number) => void
) {
    let img = new Image();
    img.id = id;
    imageElements.push(img);
    img.addEventListener("load", imageLoadCallback(id, cb));

    img.src = src;
}

function isString(str: unknown) {
    return typeof str === "string";
}

function first<T>(arr: Array<T>): T {
    return arr[0];
}

function without<T>(arr: Array<T>, exclude: T): Array<T> {
    return arr.filter((item) => item !== exclude);
}

function findIndex<T>(arr: Array<T>, pred: (val: T) => boolean): number {
    return arr.reduce((acc, val, index) => {
        if (acc >= 0) {
            return acc;
        }

        return pred(val) ? index : acc;
    }, -1);
}

function all<T>(arr: Array<T>, pred: (val: T) => boolean): boolean {
    return arr.reduce((acc: boolean, item: T) => {
        return pred(item) && acc;
    }, true);
}

function max<T>(arr: Array<T>, iteratee: (arg0: T) => number) {
    return arr.reduce((acc, item) => {
        if (iteratee(item) > iteratee(acc)) {
            return item;
        } else {
            return acc;
        }
    }, arr[0]);
}

type ImageData = {
    id: string;
    src: string;
};

type StateImageData = ImageData & {
    width: number;
    height: number;
};

interface Props {
    data: Array<string> | Array<ImageData>;
    onImageClick: (image: string) => void;
    gridSize?: string;
    containerWidth?: number;
}

interface State {
    ladyLuck: number;
    containerWidth: number;
    containerHeight: number;
    imagesToShow: Array<StateImageData>;
}

class ReactPhotoGrid extends React.Component<Props, State> {
    private containerRef = React.createRef<HTMLDivElement>();

    constructor(props: Props) {
        super(props);
        const defaultContainerWidth = 500;
        const defaultContainerHeight = 500;

        let containerWidth = defaultContainerWidth;
        let containerHeight = defaultContainerHeight;

        if (this.props.gridSize) {
            let container = this.props.gridSize.split("x");
            containerWidth = parseInt(container[0], 10) || defaultContainerWidth;
            containerHeight = parseInt(container[1], 10) || defaultContainerHeight;
        }

        const imageData =
            this.props.data.length <= 4
                ? this.props.data
                : this.props.data.slice(0, 4);
        let imagesToShow: { id: string; src: string; width: number; height: number; }[];

        if (imageData[0] && isString(imageData[0])) {
            imagesToShow = (imageData as Array<string>).map(function (
                imagePath: string
            ) {
                return {
                    id: `${Math.random() * 1000}`,
                    src: imagePath,
                    width: 0,
                    height: 0,
                };
            });
        } else {
            imagesToShow = (imageData as Array<ImageData>).map(function (
                image: ImageData
            ) {
                return {
                    ...image,
                    width: 0,
                    height: 0,
                };
            });
        }

        let state = {
            ladyLuck: Math.floor(Math.random() * 2),
            containerWidth: containerWidth,
            containerHeight: containerHeight,
            imagesToShow,
        };

        if (this.props.containerWidth) {
            state.containerWidth = this.props.containerWidth;
        }

        this.state = state;
    }

    componentWillUnmount() {
        imageElements.forEach((imageElement) => {
            imageElement.removeEventListener(
                "load",
                imageLoadCallback(imageElement.id, this.recalculateGrid)
            );
        });
    }

    componentDidMount() {
        this.state.imagesToShow.forEach((image: StateImageData) => {
            getImageDimensions(image.src, image.id, this.recalculateGrid);
        }, this);

        if (
            !this.props.gridSize &&
            this.containerRef &&
            this.containerRef.current
        ) {
            this.setState({
                containerWidth: this.containerRef.current.offsetWidth,
                containerHeight: this.containerRef.current.offsetWidth,
            });
        }
    }

    onResize = () => {
        if (this.containerRef && this.containerRef.current) {
            this.setState({
                containerWidth: this.containerRef.current.offsetWidth,
                containerHeight: this.containerRef.current.offsetWidth,
            });
        }
    };

    handleImageClick = (imageSrc: string) => {
        this.props.onImageClick && this.props.onImageClick(imageSrc);
    };

    recalculateGrid = (id: string, width: number, height: number) => {
        let _imagesToShow = [...this.state.imagesToShow];

        let imageIndex = findIndex(_imagesToShow, (image) => image.id === id);
        _imagesToShow[imageIndex].width = width;
        _imagesToShow[imageIndex].height = height;
        let indexForMaxDimensionImage = 0;
        let container = {
            width: this.state.containerWidth,
            height: this.state.containerHeight,
        };

        let contenders = ["Width", "Height"];
        let winner = contenders[this.state.ladyLuck].toLowerCase() as
            | "width"
            | "height";
        let loser = first(
            without(contenders, contenders[this.state.ladyLuck])
        ).toLowerCase() as "width" | "height";

        if (
            all(_imagesToShow, (image: StateImageData) => {
                return !!(image.width && image.height);
            })
        ) {
            let maxDimensionImage = max(_imagesToShow, (image) => image[winner]);

            indexForMaxDimensionImage = findIndex(
                _imagesToShow,
                (image) => image.id === maxDimensionImage.id
            );

            if (
                _imagesToShow[indexForMaxDimensionImage][winner] < container[winner]
            ) {
                container[winner] = _imagesToShow[indexForMaxDimensionImage][winner];
                container[loser] = container[winner];
            }

            let indexForBestMaxImage = _imagesToShow.reduce(function (
                    result,
                    image,
                    index
                ) {
                    if (
                        image[winner] >= container[winner] &&
                        image[winner] / image[loser] >
                        _imagesToShow[result][winner] / _imagesToShow[result][loser]
                    ) {
                        return index;
                    }
                    return result;
                },
                0);

            _imagesToShow.push.apply(
                _imagesToShow,
                _imagesToShow.splice(0, indexForBestMaxImage)
            );
            this.setState({
                imagesToShow: _imagesToShow,
                containerHeight: container.height,
                containerWidth: container.width,
            });
        }
    };

    getComponentStyles = (images: Array<StateImageData>) => {
        let numberOfImages = images.length;

        let marginSetters = ["Bottom", "Right"];
        let contenders = ["Width", "Height"];
        let winner = contenders[this.state.ladyLuck] as "Width" | "Height";
        let loser = first(without(contenders, winner));
        let marginWinner = marginSetters[this.state.ladyLuck];
        let marginLoser = first(without(marginSetters, marginWinner));

        let smallestDimensionRaw = Math.floor(
            this.state[`container${winner}` as "containerWidth"] /
            (numberOfImages - 1)
        );
        let margin = 2;
        let smallImageDimension = smallestDimensionRaw - margin;
        let styles: Array<any> = [];
        let commonStyle = {
            display: "inline-block",
            position: "relative",
            overflow: "hidden",
            float: "left",
            verticalAlign: "top",
            cursor: "pointer",
        };

        switch (numberOfImages) {
            case 0:
                break;
            case 1:
                if (!images[0].width) images[0].width = 1000000;
                if (!images[0].height) images[0].height = 1000000;

                if (images[0].width > images[0].height) {
                    styles = [
                        {
                            width:
                                Math.min(this.state.containerWidth, images[0].width) - margin,
                            height:
                                (Math.min(this.state.containerWidth, images[0].width) *
                                    images[0].height) /
                                images[0].width -
                                margin,
                            margin: margin,
                        },
                    ];
                } else {
                    styles = [
                        {
                            width:
                                (Math.min(this.state.containerHeight, images[0].height) *
                                    images[0].width) /
                                images[0].height -
                                margin,
                            height:
                                Math.min(this.state.containerHeight, images[0].height) - margin,
                            margin: margin,
                        },
                    ];
                }
                break;
            case 2:
                styles[0] = styles[1] = {};

                styles[0][winner.toLowerCase() as "width" | "height"] = styles[1][
                    winner.toLowerCase() as "width" | "height"
                    ] =
                    this.state[
                        `container${winner}` as "containerWidth" | "containerHeight"
                        ] - margin;
                styles[0][loser.toLowerCase()] = styles[1][loser.toLowerCase()] =
                    Math.min(smallImageDimension / 2) - margin;
                styles[0]["margin" + marginWinner] = margin;
                break;
            default:
                styles[0] = {};
                styles[0][winner.toLowerCase()] = this.state[
                    `container${winner}` as "containerWidth" | "containerHeight"
                    ];
                styles[0][loser.toLowerCase()] =
                    smallImageDimension * (numberOfImages - 2);
                styles[0]["margin" + marginWinner] = margin;
                const styleForSmallerImages: any = {
                    width: smallImageDimension,
                    height: smallImageDimension,
                };
                styleForSmallerImages["margin" + marginLoser] = margin;

                for (let i = 1; i < numberOfImages && i < 4; i++) {
                    styles.push({ ...styleForSmallerImages });
                }

                styles[numberOfImages - 1][winner.toLowerCase()] +=
                    styles[0][winner.toLowerCase()] -
                    smallImageDimension * (numberOfImages - 1) -
                    margin * (numberOfImages - 2);
                styles[numberOfImages - 1]["margin" + marginLoser] = 0;
        }

        return styles.map(function (style) {
            return {
                ...commonStyle,
                ...style,
            };
        });
    };

    render() {
        const componentStyles = this.getComponentStyles(this.state.imagesToShow);

        const images = this.state.imagesToShow.map((image, index) => {
            const componentStyle = componentStyles[index];
            let imageStyle: React.CSSProperties | undefined;

            if (
                image.width &&
                image.height &&
                componentStyle.width &&
                componentStyle.height
            ) {
                if (
                    image.width <= componentStyle.width ||
                    image.height <= componentStyle.height
                ) {
                    // do nothing
                } else if (
                    image.width / componentStyle.width <
                    image.height / componentStyle.height
                ) {
                    imageStyle = {
                        maxWidth: componentStyle.width,
                    };
                } else {
                    imageStyle = {
                        maxHeight: componentStyle.height,
                    };
                }
            }
            return (
                <div key={"image_" + index} style={componentStyle}>
                    <img
                        style={imageStyle}
                        src={image.src}
                        onClick={() => this.handleImageClick(image.src)}
                     alt={'resr'}/>
                </div>
            );
        }, this);

        const containerStyle = {
            width: this.state.containerWidth,
            height: this.state.containerWidth,
            backgroundColor: "white",
        };

        return (
            <div>
                <div style={containerStyle} ref={this.containerRef}>
                    {images}
                    <div style={{ clear: "both" }} />
                </div>
            </div>
        );
    }
}

export default ReactPhotoGrid;
