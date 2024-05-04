export default function uploadToS3(url: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return fetch(url, {
    method: "PUT",
    body: formData,
    headers: {
      "Content-Type": "image/png",
    },
  });
}
