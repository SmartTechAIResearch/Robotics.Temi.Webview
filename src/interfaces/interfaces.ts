export interface iLocationData {
  id: string;
  name: string;
  alias: string;
  textList: Array<string>;
  icon: string;
  region: string;
  move: boolean;
  onNextStep?: NextStepImpl;
  stepIndex?: number;
  visited?: boolean;
}

export interface iTtsMessage {
  temiTtsMessage: message;
}
interface message {
  data: string;
  text: string;
}

export enum NextStep {
  DEFAULT = "Default",
  EMBED = "Embed",
  LOCATION = "Location",
  VIDEO = "Video",
  IMAGE = "Image",
  NESTED = "Nested",
  BUBBLE_TO_PARENT = "Bubble",
}

export interface NextStepImpl {
  type: NextStep;
}

export interface EmbedNextStep extends NextStepImpl {
  url: string;
}

export interface ImageNextStep extends NextStepImpl {
  url: string;
}

export interface NestedNextStep extends NextStepImpl {
  locations: string[];
}

export interface BubbleNextStep extends NextStepImpl {
  parentLocation: string;
}

export enum AppState {
  Loading = "Loading",
  Error = "Error",
  Success = "Success",
  Active = "Active",
  Subpage = "Subpage",
  LastPage = "LastPage",
  NearlyLastPage = "NearlyLastPage",
}

export enum SubState {
  None,
  Idle,
  Config,
  Tutorial,
  Video,
  Image,
  Embed,
  Multipage,
  Speaking,
  Moving,
}