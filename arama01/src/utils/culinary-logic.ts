/**
 * Pure culinary and dining calculations for Arama Restaurant & Asador
 */

export interface MenuItem {
  id: string;
  nameAr: string;
  nameEn: string;
  nameEs?: string;
  category: 'grill' | 'hearth' | 'mezze' | 'drinks' | 'desserts';
  price: number;
  weightGrams?: number;
  woodType: 'holm_oak' | 'olive' | 'apple' | 'charcoal';
  spiciness: 0 | 1 | 2 | 3;
  descriptionAr: string;
  descriptionEn: string;
  image: string;
  isHouseSpecialty?: boolean;
}

export interface OrderItem {
  item: MenuItem;
  quantity: number;
  doneness?: 'bleu' | 'rare' | 'medium_rare' | 'medium' | 'well_done';
  specialNotes?: string;
}

export interface OrderSummary {
  subtotal: number;
  serviceTax: number;
  discount: number;
  total: number;
  itemCount: number;
  estimatedPrepMinutes: number;
}

/**
 * Calculates total order pricing and preparation timeline
 */
export function calculateOrderSummary(items: OrderItem[]): OrderSummary {
  const subtotal = items.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);
  const itemCount = items.reduce((acc, curr) => acc + curr.quantity, 0);

  // Group banquet discount if total exceeds $150 or more than 8 items
  const discount = subtotal >= 150 || itemCount >= 8 ? Math.round(subtotal * 0.1) : 0;
  const taxableAmount = Math.max(0, subtotal - discount);
  const serviceTax = Math.round(taxableAmount * 0.05); // 5% hospitality tax
  const total = taxableAmount + serviceTax;

  // Maximum prep time among items (hearth dishes take longer, quick grills are faster)
  let maxPrep = 12;
  for (const { item, quantity } of items) {
    let itemPrep = 15;
    if (item.category === 'grill') {
      itemPrep = (item.weightGrams && item.weightGrams > 600) ? 28 : 20;
    } else if (item.category === 'hearth') {
      itemPrep = 25;
    } else if (item.category === 'mezze') {
      itemPrep = 10;
    } else if (item.category === 'drinks') {
      itemPrep = 5;
    }
    if (quantity > 3) itemPrep += 5;
    if (itemPrep > maxPrep) maxPrep = itemPrep;
  }

  return {
    subtotal,
    serviceTax,
    discount,
    total,
    itemCount,
    estimatedPrepMinutes: items.length === 0 ? 0 : maxPrep,
  };
}

/**
 * Calculates optimal ember grilling parameters
 */
export function calculateGrillTiming(
  weightGrams: number,
  doneness: 'bleu' | 'rare' | 'medium_rare' | 'medium' | 'well_done',
  emberTempC: number = 420
): { searSecondsPerSide: number; restingMinutes: number; internalTargetC: number; recommendedWood: string } {
  const targetTemps: Record<string, number> = {
    bleu: 45,
    rare: 50,
    medium_rare: 54,
    medium: 60,
    well_done: 70,
  };

  const internalTargetC = targetTemps[doneness] || 54;
  
  // Base time per side based on weight and heat
  const heatFactor = 420 / Math.max(300, Math.min(600, emberTempC));
  const baseSeconds = Math.round((weightGrams / 100) * 45 * heatFactor);

  const donenessMultipliers: Record<string, number> = {
    bleu: 0.6,
    rare: 0.8,
    medium_rare: 1.0,
    medium: 1.3,
    well_done: 1.8,
  };

  const searSecondsPerSide = Math.round(baseSeconds * (donenessMultipliers[doneness] || 1.0));
  // Resting is crucial for prime cuts
  const restingMinutes = Math.max(3, Math.round(weightGrams / 150));

  let recommendedWood = 'حطب السنديان المعمر (Holm Oak Embers)';
  if (weightGrams < 400) {
    recommendedWood = 'حطب الزيتون العطري (Olive Wood)';
  }

  return {
    searSecondsPerSide,
    restingMinutes,
    internalTargetC,
    recommendedWood,
  };
}

/**
 * Validates aspect ratio for Gemini Omni video generator
 */
export function validateVideoAspectRatio(ratio: string): '16:9' | '9:16' {
  if (ratio === '9:16') return '9:16';
  return '16:9';
}
