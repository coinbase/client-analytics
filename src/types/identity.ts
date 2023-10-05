export type UserTypeEnum = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type SetDeviceSize = {
    height: number;
    width: number;
  };

export type Device = {
    browserName: string | null;
    browserMajor: string | null;
    osName: string | null;
    userAgent: string | null;
    height: number | null;
    width: number | null;
  };

export type Identity = {
    countryCode: string | null;
    deviceId: string | null;
    device_os: string | null;
    isOptOut: boolean;
    languageCode: string | null;
    locale: string | null;
    session_lcc_id: string | null;
    userAgent: string | null;
    userId: string | null;
    userTypeEnum?: number | null;
  };
  
export type SetIdentity = {
    countryCode?: string | null;
    deviceId?: string | null;
    device_os?: string | null;
    isOptOut?: boolean;
    languageCode?: string | null;
    locale?: string | null;
    session_lcc_id?: string | null;
    userAgent?: string | null;
    userId?: string | null;
    userTypeEnum?: UserTypeEnum | null;
  };