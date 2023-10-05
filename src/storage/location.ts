import { Location, SetLocation, Breadcrumb } from '../types/location';

export const location: Location = {
  breadcrumbs: [],
  initialUAAData: {},
  pagePath: '',
  prevPageKey: '',
  prevPagePath: '',
};

export function setBreadcrumbs(breadcrumbs: Breadcrumb[]) {
  Object.assign(location, { breadcrumbs });
}

export function setLocation(data: SetLocation) {
  Object.assign(location, data);
}
