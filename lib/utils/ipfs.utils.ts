export async function uploadToIpfs(url: string) {
  const res = await fetch(url);

  const blob = await res.blob();
  const file = new File([blob], "meme.png", { type: "image/png" });

  const formData = new FormData();
  formData.append("file", file);

  const uploadResponse = await fetch(`${process.env.APP_URL}/api/files`, {
    method: "POST",
    body: formData,
  });

  const ipfsUrl = (await uploadResponse.json()) as string;

  return ipfsUrl;
}
