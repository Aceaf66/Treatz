import { Pet, Product, RecommendationMatch, CompatibilityCheck } from '../types';

/**
 * Rule-based recommendation engine for Treatz
 * Note: Recommendations are for shopping convenience and are not veterinary advice.
 */
export function getRecommendationsForPet(pet: Pet | null, products: Product[]): RecommendationMatch[] {
  if (!pet) {
    // If no pet selected, return featured/best-sellers
    return products
      .filter(p => p.featured || p.bestSeller)
      .slice(0, 8)
      .map(product => ({
        product,
        score: 80,
        reasons: ['Popular with pet parents on Treatz', 'Customer favorite']
      }));
  }

  const matches: RecommendationMatch[] = [];

  for (const product of products) {
    let score = 0;
    const reasons: string[] = [];

    // Rule 1: Species match (Strict)
    if (product.species !== 'both' && product.species !== pet.species) {
      continue; // Skip products not made for this species
    }
    score += 40;

    // Rule 2: Food sensitivity / allergy exclusion
    let hasAllergen = false;
    if (pet.foodSensitivities && pet.foodSensitivities.length > 0) {
      for (const sensitivity of pet.foodSensitivities) {
        const lowerSens = sensitivity.toLowerCase();
        const isInName = product.name.toLowerCase().includes(lowerSens);
        const isInIngredients = product.ingredients.some(i => i.toLowerCase().includes(lowerSens));
        if (isInName || isInIngredients) {
          hasAllergen = true;
          break;
        }
      }
    }

    if (hasAllergen) {
      // Strongly deprioritize or skip
      score -= 50;
      continue;
    }

    // Rule 3: Age Group match
    const isAgeMatch = product.ageGroup.includes(pet.ageGroup) || product.ageGroup.includes('all');
    if (isAgeMatch) {
      score += 25;
      if (pet.ageGroup === 'puppy') {
        reasons.push('Contains tailored DHA & calcium for puppy growth');
      } else if (pet.ageGroup === 'kitten') {
        reasons.push('High in essential milk lipids & DHA for kitten development');
      } else if (pet.ageGroup === 'senior') {
        reasons.push('Gentle on senior teeth and fortified with joint supplements');
      } else {
        reasons.push('Optimized nutrition for healthy adult maintenance');
      }
    }

    // Rule 4: Dietary preference match
    if (product.dietaryPreference.includes(pet.dietaryPreference)) {
      score += 30;
      if (pet.dietaryPreference === 'grain_free') {
        reasons.push('100% Grain-free formulation to match dietary preference');
      } else if (pet.dietaryPreference === 'sensitive') {
        reasons.push('Easy-to-digest soothing ingredients for sensitive stomachs');
      } else if (pet.dietaryPreference === 'high_protein') {
        reasons.push('High-protein recipe supporting lean muscle definition');
      } else if (pet.dietaryPreference === 'weight_management') {
        reasons.push('Calorie-conscious balance with natural satiety fiber');
      } else if (pet.dietaryPreference === 'hypoallergenic') {
        reasons.push('Novel single-protein source to minimize allergen triggers');
      }
    }

    // Rule 5: Activity level matching
    if (pet.activityLevel === 'high') {
      if (product.tags.includes('active') || product.tags.includes('high_energy') || product.tags.includes('high_protein')) {
        score += 20;
        reasons.push(`Supports ${pet.name}'s high daily energy expenditure`);
      }
    } else if (pet.activityLevel === 'low') {
      if (product.tags.includes('weight_management') || product.tags.includes('low_calorie') || product.tags.includes('indoor')) {
        score += 15;
        reasons.push(`Balanced density tailored for relaxed indoor activity`);
      }
    }

    // Rule 6: Breed & Weight specific nuances
    if (pet.weight > 25 && (product.tags.includes('joint_care') || product.tags.includes('glucosamine'))) {
      score += 15;
      reasons.push('Fortified with glucosamine ideal for large-breed joint wellness');
    }

    if (pet.species === 'cat' && (product.tags.includes('hairball') || product.tags.includes('urinary_health'))) {
      score += 15;
      reasons.push('Feline-specific protection for digestive & urinary health');
    }

    // Default reason if few matched
    if (reasons.length === 0) {
      reasons.push(`Nutrient-complete quality choice for ${pet.name}`);
    }

    matches.push({
      product,
      score,
      reasons: reasons.slice(0, 2)
    });
  }

  // Sort descending by score
  return matches.sort((a, b) => b.score - a.score);
}

/**
 * Checks compatibility between a specific product and the active pet
 * Used for the "Is this right for your pet?" section in product details
 */
export function checkPetCompatibility(product: Product, pet: Pet | null): CompatibilityCheck {
  if (!pet) {
    return {
      isCompatible: true,
      score: 80,
      title: 'General Pet Care Standard',
      highlights: ['Nutritionally balanced and verified by quality sourcing standards.'],
      considerations: ['Create or select a pet profile to get tailored compatibility checks.']
    };
  }

  // Species mismatch
  if (product.species !== 'both' && product.species !== pet.species) {
    return {
      isCompatible: false,
      score: 10,
      title: `Not formulated for ${pet.species === 'dog' ? 'dogs' : 'cats'}`,
      highlights: [],
      considerations: [
        `This product is formulated specifically for ${product.species === 'dog' ? 'dogs' : 'cats'}, not ${pet.species}s. Nutritional requirements differ significantly.`
      ]
    };
  }

  const highlights: string[] = [];
  const considerations: string[] = [];
  let score = 75;

  // Sensitivity check
  if (pet.foodSensitivities && pet.foodSensitivities.length > 0) {
    const sensitivitiesFound = pet.foodSensitivities.filter(sens => {
      const lower = sens.toLowerCase();
      return product.name.toLowerCase().includes(lower) || product.ingredients.some(i => i.toLowerCase().includes(lower));
    });

    if (sensitivitiesFound.length > 0) {
      score -= 50;
      considerations.push(`Contains ingredient matching ${pet.name}'s sensitivities: ${sensitivitiesFound.join(', ')}.`);
    } else {
      highlights.push(`Free from ${pet.name}'s stated sensitivities (${pet.foodSensitivities.join(', ')}).`);
    }
  }

  // Diet match
  if (product.dietaryPreference.includes(pet.dietaryPreference)) {
    score += 15;
    highlights.push(`Directly matches ${pet.name}'s preferred diet (${pet.dietaryPreference.replace('_', ' ')}).`);
  }

  // Age group match
  if (product.ageGroup.includes(pet.ageGroup) || product.ageGroup.includes('all')) {
    score += 10;
    highlights.push(`Suitable for ${pet.name}'s age stage (${pet.ageGroup}).`);
  } else {
    considerations.push(`Formulated for ${product.ageGroup.join('/')} pets, while ${pet.name} is classified as ${pet.ageGroup}.`);
  }

  // Activity level match
  if (pet.activityLevel === 'high' && (product.tags.includes('high_protein') || product.tags.includes('active'))) {
    score += 10;
    highlights.push(`Supports high stamina and energy for an active lifestyle.`);
  }

  score = Math.min(100, Math.max(10, score));

  return {
    isCompatible: score >= 60,
    score,
    title: score >= 80 
      ? `Excellent Match for ${pet.name} 🐾` 
      : score >= 60 
        ? `Good Compatibility with ${pet.name}` 
        : `Check Ingredients Carefully for ${pet.name}`,
    highlights,
    considerations
  };
}
