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
  isAuthed: () => boolean;
};

export type SetIdentity = Partial<Identity>;
