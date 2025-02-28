export async function uploadToIpfs(url: string, isServer: boolean, raw?: Blob) {
  let blob: Blob;

  if (raw) {
    blob = raw;
  } else {
    const res = await fetch(url);
    blob = await res.blob();
  }

  const file = new File([blob], "meme.png", { type: "image/png" });

  const formData = new FormData();
  formData.append("file", file);

  const APP_URL = isServer ? `${process.env.APP_URL}/api/files` : "/api/files";

  const uploadResponse = await fetch(APP_URL, {
    method: "POST",
    body: formData,
  });

  const ipfsUrl = (await uploadResponse.json()) as string;

  return ipfsUrl;
}
