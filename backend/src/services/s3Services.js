import { S3Client, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const getFileFromS3 = async (key) => {
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
    });
    return await s3.send(command);
};

const deleteFileFromS3 = async (key) => {
    const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
    });
    return await s3.send(command);
};

const getKeyFromUrl = (url) => {
    try {
        const parsedUrl = new URL(url);
        return decodeURIComponent(parsedUrl.pathname.substring(1));
    } catch (e) {
        return url;
    }
};

export default { getFileFromS3, deleteFileFromS3 , getKeyFromUrl };