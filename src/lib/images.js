function imageLib() {
    const aws = require("aws-sdk");
    const s3 = new aws.S3();
    const sharp = require("sharp");
    const crypto = require("crypto");
    this.resizeImage = ({ image, width, height, format = "jpeg" }) => {
        console.log("resizeImage", width, height);
        return sharp(image).rotate().resize(width, height).toFormat(format, { quality: 50 }).toBuffer();
    };

    this.uploadToS3 = ({ body, bucket, key, format = "jpeg" }) => {
        console.log("start upload", key);

        return s3
            .putObject({
                Bucket: bucket,
                Key: key,
                ACL: "public-read",
                Body: body,
                ContentType: "image/" + format,
                CacheControl: "public, max-age=1209600, must-revalidate"
            })
            .promise();
    };

    this.resizeAndUpload = ({ image, width, height, key, format = "jpeg" }) => {
        console.log("start resize and upload", key);
        return this.resizeImage({
            image: image,
            width: Math.round(width),
            height: Math.round(height),
            format
        })
            .then((buffData) => {
                console.log("resized image");
                return this.uploadToS3({
                    bucket: process.env.S3_BUCKET_USERS,
                    key: key,
                    body: buffData,
                    format
                });
            })
            .catch((err) => {
                console.log(err);
                return err;
            });
    };

    this.createResponsiveImagesAndUpload = async ({ image, width, height, userId, key, format = "jpeg" }) => {
        let hash = crypto.createHash("sha256").update(image).digest("hex").substring(0, 8);

        let results = await Promise.all([
            this.resizeAndUpload({
                image,
                width,
                height,
                format,
                key: userId + "/" + key + "_lg.jpg"
            }),
            this.resizeAndUpload({
                image,
                width: width / 2,
                height: height / 2,
                format,
                key: userId + "/" + key + "_md.jpg"
            }),
            this.resizeAndUpload({
                image,
                width: width / 3,
                height: height / 3,
                format,
                key: userId + "/" + key + "_sm.jpg"
            })
        ]);
        if (results && !results.find((r) => !r.ETag)) {
            return [process.env.S3_URL, process.env.S3_BUCKET_USERS, userId, key + "_lg.jpg?v=" + hash].join("/");
        }
    };

    return this;
}
module.exports = imageLib();
