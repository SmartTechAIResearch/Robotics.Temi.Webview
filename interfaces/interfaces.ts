export interface iLocationData {
  id: string;
  name: string;
  textList: Array<string>;
}

export interface iTtsMessage {
  temiTtsMessage: message;
}
interface message {
  data: string;
  text: string;
}
