import Resizer from 'react-image-file-resizer'

export const resizeFile = (file: Blob, maxHeight: number, maxWidth: number, thumbnail: boolean) => {
  return new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      maxWidth,
      maxHeight,
      'JPEG',
      thumbnail ? 70 : 80,
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
