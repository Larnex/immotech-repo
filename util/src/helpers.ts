import { useTranslation } from 'react-i18next';

const { t } = useTranslation();

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  noFormat?: boolean,
): string | number {
  const R = 6371000; // Radius of the earth in meters
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in meters
  if (noFormat) {
    return distance;
  }

  return formatDistance(distance);
}

export function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function formatDistance(distance: number | undefined) {
  if (!distance) return t('properties_list.distance_unknown');

  const roundDistance = distance.toFixed(0);
  if (+roundDistance < 1000) {
    return `${roundDistance} m`;
  } else {
    const kilometers = (+roundDistance / 1000).toFixed(1);
    return `${kilometers} km`;
  }
}

export function preventMultiClick(
  func: (...args: any[]) => void,
  delay = 1000,
): (...args: any[]) => void {
  let lastClickTime = 0;

  return (...args): void => {
    const currentTime = Date.now();

    if (currentTime - lastClickTime < delay) {
      return; // Ignore the click
    }

    lastClickTime = currentTime;
    func(...args);
  };
}
