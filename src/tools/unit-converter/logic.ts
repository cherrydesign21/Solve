export interface UnitDef {
  id: string;
  label: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

export interface UnitCategoryDef {
  id: string;
  label: string;
  units: UnitDef[];
}

function linearUnit(id: string, label: string, factor: number): UnitDef {
  return {
    id,
    label,
    toBase: (v) => v * factor,
    fromBase: (v) => v / factor,
  };
}

export const unitCategories: UnitCategoryDef[] = [
  {
    id: "length",
    label: "Length",
    units: [
      linearUnit("mm", "Millimeter (mm)", 0.001),
      linearUnit("cm", "Centimeter (cm)", 0.01),
      linearUnit("m", "Meter (m)", 1),
      linearUnit("km", "Kilometer (km)", 1000),
      linearUnit("in", "Inch (in)", 0.0254),
      linearUnit("ft", "Foot (ft)", 0.3048),
      linearUnit("yd", "Yard (yd)", 0.9144),
      linearUnit("mi", "Mile (mi)", 1609.344),
    ],
  },
  {
    id: "mass",
    label: "Weight",
    units: [
      linearUnit("mg", "Milligram (mg)", 0.000001),
      linearUnit("g", "Gram (g)", 0.001),
      linearUnit("kg", "Kilogram (kg)", 1),
      linearUnit("t", "Tonne (t)", 1000),
      linearUnit("oz", "Ounce (oz)", 0.0283495),
      linearUnit("lb", "Pound (lb)", 0.453592),
    ],
  },
  {
    id: "temperature",
    label: "Temperature",
    units: [
      { id: "c", label: "Celsius (°C)", toBase: (v) => v, fromBase: (v) => v },
      {
        id: "f",
        label: "Fahrenheit (°F)",
        toBase: (v) => ((v - 32) * 5) / 9,
        fromBase: (v) => (v * 9) / 5 + 32,
      },
      { id: "k", label: "Kelvin (K)", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
    ],
  },
  {
    id: "volume",
    label: "Volume",
    units: [
      linearUnit("ml", "Milliliter (ml)", 0.001),
      linearUnit("l", "Liter (l)", 1),
      linearUnit("m3", "Cubic Meter (m³)", 1000),
      linearUnit("gal", "US Gallon (gal)", 3.78541),
      linearUnit("qt", "US Quart (qt)", 0.946353),
      linearUnit("cup", "Cup", 0.236588),
      linearUnit("floz", "Fluid Ounce (fl oz)", 0.0295735),
    ],
  },
  {
    id: "speed",
    label: "Speed",
    units: [
      linearUnit("mps", "Meters/second (m/s)", 1),
      linearUnit("kph", "Kilometers/hour (km/h)", 0.277778),
      linearUnit("mph", "Miles/hour (mph)", 0.44704),
      linearUnit("kn", "Knot (kn)", 0.514444),
      linearUnit("fps", "Feet/second (ft/s)", 0.3048),
    ],
  },
  {
    id: "time",
    label: "Time",
    units: [
      linearUnit("s", "Second", 1),
      linearUnit("min", "Minute", 60),
      linearUnit("hr", "Hour", 3600),
      linearUnit("day", "Day", 86_400),
      linearUnit("week", "Week", 604_800),
      linearUnit("month", "Month (30d)", 2_592_000),
      linearUnit("year", "Year (365d)", 31_536_000),
    ],
  },
  {
    id: "area",
    label: "Area",
    units: [
      linearUnit("mm2", "sq Millimeter", 0.000001),
      linearUnit("cm2", "sq Centimeter", 0.0001),
      linearUnit("m2", "sq Meter", 1),
      linearUnit("ha", "Hectare", 10_000),
      linearUnit("km2", "sq Kilometer", 1_000_000),
      linearUnit("ft2", "sq Foot", 0.092903),
      linearUnit("yd2", "sq Yard", 0.836127),
      linearUnit("acre", "Acre", 4_046.86),
      linearUnit("mi2", "sq Mile", 2_589_988.11),
    ],
  },
  {
    id: "digital",
    label: "Data",
    units: [
      linearUnit("bit", "Bit", 0.125),
      linearUnit("byte", "Byte", 1),
      linearUnit("kb", "Kilobyte (KB)", 1024),
      linearUnit("mb", "Megabyte (MB)", 1024 ** 2),
      linearUnit("gb", "Gigabyte (GB)", 1024 ** 3),
      linearUnit("tb", "Terabyte (TB)", 1024 ** 4),
    ],
  },
];

export function convert(value: number, category: UnitCategoryDef, fromId: string, toId: string): number {
  const fromUnit = category.units.find((u) => u.id === fromId);
  const toUnit = category.units.find((u) => u.id === toId);
  if (!fromUnit || !toUnit || !Number.isFinite(value)) return 0;
  return toUnit.fromBase(fromUnit.toBase(value));
}

export function smartDecimals(value: number): number {
  if (!Number.isFinite(value)) return 0;
  const abs = Math.abs(value);
  if (abs === 0 || (Number.isInteger(value) && abs < 1e12)) return 0;
  if (abs >= 100) return 2;
  if (abs >= 1) return 4;
  return 6;
}
