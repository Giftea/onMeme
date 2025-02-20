export const downloadMeme = (url: string) => {
    if (!url) return;
    const link = document.createElement("a");
    link.href = url;
    link.download = "meme.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };