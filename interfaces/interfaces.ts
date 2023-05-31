export interface iLocationData {
  id: string;
  name: string;
  alias: string;
  textList: Array<string>;
  icon: string;
  region: string;
  move: boolean;
}

export interface iTtsMessage {
  temiTtsMessage: message;
}
interface message {
  data: string;
  text: string;
}
