import md5 from 'md5';

export const getChecksum = (stringifiedEventData: string, uploadTime: string) => {
    return md5(stringifiedEventData + uploadTime);
};
