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
