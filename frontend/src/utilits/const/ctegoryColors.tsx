
export const normalizeHex = (argb: string | null | undefined): string => {
  if (!argb) return "64748b";
  let hex = argb.trim().replace(/^#/, "");

  if (hex.length === 3) {
    hex = hex.split("").map((c) => c + c).join("");
  }
  if (hex.length === 8) {
    hex = hex.substring(2);
  }
  // Validate
  if (hex.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(hex)) {
    return "64748b";
  }
  return hex.toLowerCase();
};

export const convertARGBToHex = (argb: string | null | undefined): string => {
  return `#${normalizeHex(argb)}`;
};

export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const clean = normalizeHex(hex);
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
};

export const getColorWithOpacity = (argb: string, alpha = 0.12): string => {
  const { r, g, b } = hexToRgb(argb);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const getLuminance = (argb: string): number => {
  const { r, g, b } = hexToRgb(argb);
  const [rs, gs, bs] = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

export const darkenColor = (argb: string, amount = 0.5): string => {
  const { r, g, b } = hexToRgb(argb);
  const dr = Math.round(r * (1 - amount));
  const dg = Math.round(g * (1 - amount));
  const db = Math.round(b * (1 - amount));
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(dr)}${toHex(dg)}${toHex(db)}`;
};


export const getReadableTextColor = (argb: string): string => {
  const luminance = getLuminance(argb);
  // Threshold: 0.5 is a good sweet spot for badges on white bg
  return luminance > 0.5 ? darkenColor(argb, 0.5) : convertARGBToHex(argb);
};