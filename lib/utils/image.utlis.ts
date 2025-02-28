import sharp from "sharp";

const waterMarkText = "made on on-meme.vercel.app";

export const addWatermark = async (url: string) => {
  const waterMarkFontSize = 14;
  const font = "Arial Bold";

  const response = await fetch(url);
  const buffer = await response.arrayBuffer();

  const image = sharp(Buffer.from(buffer));

  const metadata = await image.metadata();
  const width = metadata.width || 0;
  const height = metadata.height || 0;

  const watermarkSvg = `
      <svg width="${width}" height="${height}">
        <text
          x="10" y="${height - 10}"
          font-family="${font}"
          font-size="${waterMarkFontSize}"
          fill="white"
          stroke="black"
          stroke-width="2"
          stroke-linejoin="round"
      >
        ${waterMarkText}
      </text>
      </svg>
    `;

  const watermarkedImage = await image
    .composite([
      {
        input: Buffer.from(watermarkSvg),
        gravity: "southwest",
      },
    ])
    .toFormat("png")
    .toBuffer();

  const result = watermarkedImage.toString("base64");
  return base64ToBlob(result, "image/png");
};

const base64ToBlob = (base64: string, mimeType: string) => {
  const byteCharacters = atob(base64); // Decode base64
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};
