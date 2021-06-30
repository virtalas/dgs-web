import Resizer from 'react-image-file-resizer'

export const resizeFile = (file: Blob, thumbnailMaxHeight: number, thumbnailMaxWidth: number, photoMaxDimension: number, thumbnail: boolean) => {
  const maxWidth = thumbnail ? thumbnailMaxWidth : photoMaxDimension
  const maxHeight = thumbnail ? thumbnailMaxHeight : photoMaxDimension

  return new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      maxWidth,
      maxHeight,
      'JPEG',
      thumbnail ? 65 : 80,
      0,
      (uri) => resolve(uri),
      'base64'
    )
  })
}

export const toBase64 = (file: File) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
})
