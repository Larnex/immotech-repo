// import { check, PERMISSIONS, request, RESULTS } from "react-native-permissions";
// import Snackbar from "react-native-snackbar";
// import RNFetchBlob from "rn-fetch-blob";
// import { getAuthToken } from "../../feature/api/src";

// const download = async (url: string, title?: string) => {
//   const { config, fs } = RNFetchBlob;

//   let DownloadDir = fs.dirs.DownloadDir;
//   let options = {
//     trusty: true,
//     addAndroidDownloads: {
//       useDownloadManager: true,
//       notification: true,
//       path: `${DownloadDir}/test.pdf`,
//       description: "Protocol PDF",
//       title: "test.pdf",
//       mediaScannable: true,
//     },
//   };

//   let token = await getAuthToken().then((res) => res);

//   await config({
//     trusty: true,
//     fileCache: true,
//     addAndroidDownloads: {
//       useDownloadManager: true,
//       path: `${DownloadDir}/test.pdf`,
//     },
//   })
//     .fetch("GET", url)
//     .then((res) => {
//       
//         "🚀 ~ file: android-storage-permission.ts ~ line 28 ~ .then ~ res",
//         res.path()
//       );
//       Snackbar.show({
//         text: "Downloaded Successfully",
//         duration: Snackbar.LENGTH_SHORT,
//       });
//     })
//     .catch((err) => {
//       
//     });
// };

// const requestDownloadPermission = (url: string, title?: string) => {
//   request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then((result) => {
//     if (result === "granted") {
//       download(url, title);
//     }
//   });
// };

// export const checkDownloadPermission = async (url: string, title?: string) => {
//   check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)
//     .then((result) => {
//       switch (result) {
//         case RESULTS.UNAVAILABLE:
//           Snackbar.show({
//             text: "Feature not available on your phone",
//             duration: Snackbar.LENGTH_SHORT,
//           });
//           break;
//         case RESULTS.DENIED:
//           requestDownloadPermission(url, title);
//           break;
//         case RESULTS.GRANTED:
//           download(url, title);
//           break;
//         case RESULTS.BLOCKED:
//           Snackbar.show({
//             text: "You have blocked the permission to write to the storage",
//             duration: Snackbar.LENGTH_SHORT,
//           });
//           break;
//       }
//     })
//     .catch((error) => {
//       Snackbar.show({ text: `${error}`, duration: Snackbar.LENGTH_SHORT });
//     });
// };
