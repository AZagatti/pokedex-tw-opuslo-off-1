export function berrySprite(name: string): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${name}-berry.png`;
}

export const FLAVOR_COLORS: Record<string, string> = {
  spicy: "#ef5350",
  dry: "#42a5f5",
  sweet: "#ec407a",
  bitter: "#66bb6a",
  sour: "#ffca28",
};

export function flavorColor(flavor: string): string {
  return FLAVOR_COLORS[flavor] ?? "#9099a1";
}
