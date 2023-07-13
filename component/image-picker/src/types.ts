export type ImagePickerResponse = {
  path: string;
  width: number;
  height: number;
  size?: number;
  data: string;
  mime?: string;
  modificationDate?: string;
};

export enum ImageSource {
  CAMERA = "CAMERA",
  GALLERY = "GALLERY",
}
