import seedrandom from "seedrandom";

export function hexEncode(string: string): string {
  const randomColor = Math.floor(seedrandom(string)() * 25553753).toString(16);
  return randomColor.slice(-6);
}

export function invertHex(hexCode: string): string {
  if (hexCode.startsWith("#")) {
    hexCode = hexCode.slice(1);
  }

  const r = parseInt(hexCode.slice(0, 2), 16);
  const g = parseInt(hexCode.slice(2, 4), 16);
  const b = parseInt(hexCode.slice(4, 6), 16);

  const invertedR = 255 - r;
  const invertedG = 255 - g;
  const invertedB = 255 - b;

  return `#${invertedR.toString(16).padStart(2, "0").toUpperCase()}${invertedG
    .toString(16)
    .padStart(2, "0")
    .toUpperCase()}${invertedB.toString(16).padStart(2, "0").toUpperCase()}`;
}

export async function getBinaryFromFile(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", (err) => reject(err));
    reader.readAsArrayBuffer(file);
  });
}

export const UNICODE_EMOJIS = [
  "😁",
  "😂",
  "😃",
  "😄",
  "😅",
  "😆",
  "😉",
  "😊",
  "😋",
  "😌",
  "😍",
  "😏",
  "😒",
  "😓",
  "😔",
  "😖",
  "😮",
  "😘",
  "😚",
  "😜",
  "😝",
  "😞",
  "😠",
  "😡",
  "😢",
  "😣",
  "😤",
  "😥",
  "😨",
  "😩",
  "😪",
  "😫",
  "😭",
  "😰",
  "😱",
  "😲",
  "😳",
  "😵",
  "😷",
  "🌝",
  "🌚",
  "😎",
  "🍆",
  "🐒",
  "🐔",
  "😈",
  "🙌",
  "🙏",
  "👊",
  "👍",
  "💔",
  "💩",
  "🔥",
];
