export async function uploadToIpfs(url: string, server: boolean) {
  const res = await fetch(url);

  const blob = await res.blob();
  const file = new File([blob], "meme.png", { type: "image/png" });

  const formData = new FormData();
  formData.append("file", file);

  const APP_URL = server ? `${process.env.APP_URL}/api/files` : " /api/files";

  const uploadResponse = await fetch(APP_URL, {
    method: "POST",
    body: formData,
  });

  console.log("uploadResponse", uploadResponse);

  const ipfsUrl = (await uploadResponse.json()) as string;

  return ipfsUrl;
}
