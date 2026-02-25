export type Place = {
  name: string;
  text?: string | null;
  location: string;
  date: string;
  model: string;
  audio?: string | null;
  position: [number, number, number];
  size: number;
};
