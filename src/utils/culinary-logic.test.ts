import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateOrderSummary, calculateGrillTiming, validateVideoAspectRatio, MenuItem, OrderItem } from './culinary-logic.ts';

const mockSteak: MenuItem = {
  id: 'chuleta-1',
  nameAr: 'شوليتون الباسك الفاخر',
  nameEn: 'Basque Txuleta Ribeye',
  category: 'grill',
  price: 68,
  weightGrams: 850,
  woodType: 'holm_oak',
  spiciness: 0,
  descriptionAr: 'شريحة لحم بقر معتق 45 يوماً مشوية على جمر السنديان',
  descriptionEn: '45-day dry aged bone-in ribeye on oak embers',
  image: '/assets/chuleta.jpg',
};

const mockHearthPot: MenuItem = {
  id: 'fakhara-1',
  nameAr: 'فخارة موزات بالفرن الحجري',
  nameEn: 'Stone Oven Clay Pot Lamb Shank',
  category: 'hearth',
  price: 36,
  woodType: 'olive',
  spiciness: 1,
  descriptionAr: 'موزات غنم طرية مطهوة ببطء في الفرن الحجري مع الخضار',
  descriptionEn: 'Slow braised lamb shank in artisanal clay pot',
  image: '/assets/fakhara.jpg',
};

test('calculateOrderSummary calculates correct subtotal and tax', () => {
  const items: OrderItem[] = [
    { item: mockSteak, quantity: 1 },
    { item: mockHearthPot, quantity: 2 },
  ];
  const summary = calculateOrderSummary(items);
  // subtotal = 68 + 72 = 140
  assert.equal(summary.subtotal, 140);
  assert.equal(summary.itemCount, 3);
  assert.equal(summary.discount, 0); // below 150 and count < 8
  assert.equal(summary.serviceTax, 7); // 5% of 140
  assert.equal(summary.total, 147);
  assert.ok(summary.estimatedPrepMinutes >= 25);
});

test('calculateOrderSummary applies banquet discount for large orders', () => {
  const items: OrderItem[] = [
    { item: mockSteak, quantity: 3 }, // 68 * 3 = 204
  ];
  const summary = calculateOrderSummary(items);
  assert.equal(summary.subtotal, 204);
  assert.equal(summary.discount, 20); // 10% rounded
  assert.equal(summary.serviceTax, 9); // 5% of (204 - 20 = 184) = 9.2 -> 9
  assert.equal(summary.total, 193);
});

test('calculateGrillTiming produces accurate heat and resting parameters', () => {
  const timing = calculateGrillTiming(850, 'medium_rare', 420);
  assert.ok(timing.searSecondsPerSide > 300);
  assert.equal(timing.internalTargetC, 54);
  assert.ok(timing.restingMinutes >= 5);
  assert.ok(timing.recommendedWood.includes('Holm Oak'));
});

test('validateVideoAspectRatio only returns supported aspect ratios', () => {
  assert.equal(validateVideoAspectRatio('16:9'), '16:9');
  assert.equal(validateVideoAspectRatio('9:16'), '9:16');
  assert.equal(validateVideoAspectRatio('1:1'), '16:9'); // fallback
});
