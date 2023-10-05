
export type Breadcrumb = {
  label: string;
  href: string;
};

export type ReferrerData = {
  referrer?: string;
  referring_domain?: string;
};

export type UAAData = {
  fbclid?: string;
  gclid?: string;
  msclkid?: string;
  ptclid?: string;
  ttclid?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
} & ReferrerData;

export type SetLocation = {
  breadcrumbs?: Breadcrumb[];
  initialUAAData?: UAAData;
  pagePath?: string;
  prevPageKey?: string;
  prevPagePath?: string;
};

export type Location = {
    breadcrumbs: Breadcrumb[];
    initialUAAData: UAAData;
    pagePath: string;
    prevPageKey: string;
    prevPagePath: string;
  };