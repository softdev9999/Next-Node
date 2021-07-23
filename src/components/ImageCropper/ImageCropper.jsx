import React, { useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Button, Dialog, DialogTitle, DialogActions, DialogContent, IconButton, CircularProgress } from "@material-ui/core";
import ReactCrop from "react-image-crop";
import FileSelect from "../FileSelect/FileSelect";
import EditIcon from "@material-ui/icons/EditRounded";
import { useCallback } from "react";
import { useEffect } from "react";
import ErrorIcon from "@material-ui/icons/ErrorOutlineOutlined";
import SuccessIcon from "@material-ui/icons/CheckCircleOutlineOutlined";
const useStyles = makeStyles((theme) => ({
    dialogButtons: {
        justifyContent: "flex-end"
    },
    statusOverlay: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        zIndex: 100,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: theme.transitions.create(["opacity", "background-color"]),
        backgroundColor: "rgba(0,0,0,.35)"
    },
    iconButton: {
        backgroundColor: "#8E8E93",
        position: "absolute",
        right: (props) => (props.editIconRight && props.editIconRight) || 0,
        bottom: (props) => (props.editIconBottom && props.editIconBottom) || 0,
        zIndex: 100,
        width: theme.functions.rems(28),
        height: theme.functions.rems(28)
    }
}));

const ImageCropper = ({
    children,
    aspectRatio,
    targetWidth = 300,
    round,
    onFinished,
    onCanceled,
    showEditIcon,
    title,
    status,
    onStatusTimeout,
    editIconRight,
    editIconBottom,
    borderRadius,
    height,
    onError,
    classname
}) => {
    const classes = useStyles({ editIconRight, editIconBottom });
    const [imageBlob, setImageBlob] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const imgRef = useRef();
    const [imageCrop, setImageCrop] = useState({ aspect: aspectRatio, height: 300, unit: "px", x: 25, y: 25 });
    const onImageChange = (e) => {
        console.log(e);

        setImageBlob(e);
    };

    const dismiss = (confirm) => {
        if (croppedImage && confirm) {
            onFinished(croppedImage);
        } else {
            onCanceled && onCanceled();
        }
        setImageBlob(null);
        setCroppedImage(null);
        setImageCrop({ aspect: aspectRatio, height: 300, unit: "px", x: 25, y: 25 });
    };

    const onCrop = (crop, pixelCrop) => {
        setImageCrop(pixelCrop);
    };
    const onCropComplete = (crop, pixelCrop) => {
        console.log(crop, pixelCrop);
        if (imgRef && imgRef.current && crop.width && crop.height) {
            getCroppedImg(imgRef.current, pixelCrop, "cropped").then((data) => {
                console.log(data);
                setCroppedImage(data);
            });
        }
    };

    const getCroppedImg = (image, crop, fileName) => {
        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetWidth / aspectRatio;
        const ctx = canvas.getContext("2d");
        let start = {
            x: image.naturalWidth * (crop.x / 100),
            y: image.naturalHeight * (crop.y / 100),
            w: image.naturalWidth * (crop.width / 100),
            h: image.naturalHeight * (crop.height / 100)
        };
        let dest = {
            x: 0,
            y: 0,
            w: targetWidth,
            h: targetWidth / aspectRatio
        };
        ctx.drawImage(image, start.x, start.y, start.w, start.h, dest.x, dest.y, dest.w, dest.h);

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    //reject(new Error('Canvas is empty'));
                    console.error("Canvas is empty");
                    return;
                }
                blob.name = fileName;

                resolve(blob);
            }, "image/jpeg");
        });
    };

    const getStatusOverlay = () => {
        switch (status) {
            case "loading": {
                return (
                    <div className={classes.statusOverlay} style={{ borderRadius: round ? "50%" : 0 }}>
                        <CircularProgress size={"4rem"} color="inherit" />
                    </div>
                );
            }
            case "error": {
                return (
                    <div className={classes.statusOverlay} style={{ borderRadius: round ? "50%" : 0 }}>
                        <ErrorIcon style={{ fontSize: "4rem", color: "rgba(255,0,255,.8)" }} />
                    </div>
                );
            }
            case "success": {
                return (
                    <div className={classes.statusOverlay} style={{ borderRadius: round ? "50%" : 0 }}>
                        <SuccessIcon style={{ fontSize: "4rem", color: "rgba(255,255,255,.8)" }} />
                    </div>
                );
            }
            default: {
                return <div className={classes.statusOverlay} style={{ backgroundColor: "rgba(0,0,0,0)", borderRadius: round ? "50%" : 0 }} />;
            }
        }
    };

    useEffect(() => {
        if (status && status != "loading") {
            let t = setTimeout(() => {
                onStatusTimeout(null);
            }, 5000);
            return () => {
                clearTimeout(t);
            };
        }
    }, [status]);

    return (
        <Grid container spacing={1} justify={"center"} className={classname}>
            <Grid item xs={12}>
                {
                    <FileSelect
                        accept={["jpeg", "png"]}
                        onDataUrl={onImageChange}
                        onError={onError}
                        style={{ width: "auto" }}
                        round={round}
                        title={title}
                        radius={borderRadius}
                        height={height}
                    >
                        {children}
                        {getStatusOverlay()}
                        {showEditIcon && (
                            <IconButton className={classes.iconButton}>
                                <EditIcon style={{ height: "1rem", width: "1rem" }} />
                            </IconButton>
                        )}
                    </FileSelect>
                }
                <Dialog open={!!imageBlob} maxWidth={"md"} container={() => (typeof document !== "undefined" ? document.body : null)}>
                    <DialogTitle>Crop Image</DialogTitle>
                    <DialogContent>
                        {!!imageBlob && (
                            <ReactCrop
                                keepSelection={true}
                                src={imageBlob}
                                crop={imageCrop}
                                ruleOfThirds
                                onChange={onCrop}
                                onComplete={onCropComplete}
                                onImageLoaded={(img) => (imgRef.current = img)}
                            />
                        )}
                    </DialogContent>
                    <DialogActions className={classes.dialogButtons}>
                        <Button variant="outlined" color="default" fullWidth onClick={() => dismiss(false)}>
                            CANCEL
                        </Button>
                        <Button variant="contained" color="default" fullWidth onClick={() => dismiss(true)}>
                            SAVE
                        </Button>
                    </DialogActions>
                </Dialog>
            </Grid>
            {!!imageBlob &&
                (round === true ? (
                    <style dangerouslySetInnerHTML={{ __html: `.ReactCrop__crop-selection { border-radius:50%; }` }} />
                ) : (
                    <style dangerouslySetInnerHTML={{ __html: `.ReactCrop__crop-selection { border-radius:0%; }` }} />
                ))}
        </Grid>
    );
};

export default ImageCropper;
