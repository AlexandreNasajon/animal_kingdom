// This is a utility file to help identify and fix the Prey card text issue
// You can import and use this in your game components

export function truncateCardEffect(effect: string, maxLength = 60): string {
  if (!effect || effect.length <= maxLength) return effect
  return effect.substring(0, maxLength - 3) + "..."
}

// Use this function when displaying card effects:
// import { truncateCardEffect } from '@/utils/prey-text-fix';
// ...
// <div className="text-[9px]">{truncateCardEffect(card.effect)}</div>
