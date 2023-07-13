import RNFetchBlob from 'rn-fetch-blob';
import FileViewer from 'react-native-file-viewer';
import { getAuthToken } from '@immotech-feature/api';

export async function downloadAndOpenPdfFile(url: string, fileName: string) {
  try {

    const { dirs } = RNFetchBlob.fs;
    const path = `${dirs.DownloadDir}/${fileName}`;

    RNFetchBlob.config({
      fileCache: true,
      appendExt: 'pdf',
      path,
    })
      .fetch('GET', url, {
        'X-CSRF-Token': await getAuthToken().then(res => res),
      })
      .then(res => {

        // Open the downloaded PDF file
        FileViewer.open(res.path())
          .then(() => {
            
          })
          .catch(error => {
            console.error('Error opening the file', error);
          });
      })
      .catch(error => {
        console.error('Error downloading PDF:', error);
      });
  } catch (error) {
    
  }
}
