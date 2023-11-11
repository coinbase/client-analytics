import md5 from 'md5';

export const getChecksum = (apiKey: string, stringifiedEventData: string, uploadTime: string) => {
    const apiKeyCheck = apiKey || '';
    return md5(apiKeyCheck + stringifiedEventData + uploadTime);
};