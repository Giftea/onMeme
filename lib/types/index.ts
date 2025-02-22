export type Meme = {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
};

export interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontColor: string;
  strokeColor: string;
  fontFamily: string;
  isDragging: boolean;
}

export interface StatusMessage {
  message: string;
  type: "success" | "error" | "info" | "";
}
