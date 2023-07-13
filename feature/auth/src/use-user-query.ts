import { useQuery } from "@immotech-feature/api";

interface PhotoURL {
  url: string;
}

export interface User {
  data: UserData;
  name: string;
  picture: PhotoURL | undefined;
  created: string;
}

export interface GeoLocation {
  country: string;
  region: string;
  city: string;
}
export interface UserData {
  uid: string;
  geoip_location: GeoLocation;
  last_name: string;
}

export function useUserQuery({ userId }: { userId?: string }) {
  
  return useQuery<User>(`/api/app/user/${userId}`, ["user", userId], {
    enabled: !!userId,
  });
}
