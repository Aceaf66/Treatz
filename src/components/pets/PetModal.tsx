import React, { useState, useEffect } from 'react';
import { Pet, PetSpecies, AgeGroup, ActivityLevel, DietaryPreference } from '../../types';
import { useStore } from '../../context/StoreContext';
import { X, Sparkles, Dog, Cat } from 'lucide-react';

export const PetModal: React.FC = () => {
  const { isPetModalOpen, setIsPetModalOpen, editingPet, setEditingPet, addPet, updatePet } = useStore();

  const [species, setSpecies] = useState<PetSpecies>('dog');
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('2 years');
  const [ageGroup, setAgeGroup] = useState<'puppy' | 'kitten' | 'adult' | 'senior'>('adult');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weight, setWeight] = useState<number>(15);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
  const [dietaryPreference, setDietaryPreference] = useState<DietaryPreference>('regular');
  const [foodSensitivities, setFoodSensitivities] = useState<string[]>([]);
  const [sensitivityInput, setSensitivityInput] = useState('');
  const [image, setImage] = useState('');

  // Preset images
  const dogPresets = [
    'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=600&q=80',
  ];

  const catPresets = [
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=600&q=80',
  ];

  useEffect(() => {
    if (editingPet) {
      setSpecies(editingPet.species);
      setName(editingPet.name);
      setBreed(editingPet.breed);
      setAge(editingPet.age);
      setAgeGroup(editingPet.ageGroup);
      setGender(editingPet.gender);
      setWeight(editingPet.weight);
      setActivityLevel(editingPet.activityLevel);
      setDietaryPreference(editingPet.dietaryPreference);
      setFoodSensitivities(editingPet.foodSensitivities || []);
      setImage(editingPet.image || '');
    } else {
      // Default reset
      setSpecies('dog');
      setName('');
      setBreed('');
      setAge('2 years');
      setAgeGroup('adult');
      setGender('male');
      setWeight(15);
      setActivityLevel('moderate');
      setDietaryPreference('regular');
      setFoodSensitivities([]);
      setImage(dogPresets[0]);
    }
  }, [editingPet, isPetModalOpen]);

  if (!isPetModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const petPayload = {
      name: name.trim(),
      species,
      breed: breed.trim() || (species === 'dog' ? 'Mixed Breed' : 'Domestic Shorthair'),
      age,
      ageGroup,
      gender,
      weight: Number(weight) || 10,
      activityLevel,
      dietaryPreference,
      foodSensitivities,
      image: image || (species === 'dog' ? dogPresets[0] : catPresets[0]),
      isDefault: editingPet ? editingPet.isDefault : false
    };

    if (editingPet) {
      updatePet({ ...petPayload, id: editingPet.id });
    } else {
      addPet(petPayload);
    }

    setIsPetModalOpen(false);
    setEditingPet(null);
  };

  const addSensitivityTag = (tag: string) => {
    const clean = tag.trim();
    if (clean && !foodSensitivities.includes(clean)) {
      setFoodSensitivities([...foodSensitivities, clean]);
      setSensitivityInput('');
    }
  };

  const removeSensitivityTag = (tag: string) => {
    setFoodSensitivities(foodSensitivities.filter(s => s !== tag));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div 
        id="pet-modal-container"
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-purple-100 my-8 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-[#4A154B]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 leading-tight">
                {editingPet ? `Edit ${editingPet.name}'s Profile` : 'Create Your Pet Profile'}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Tailors nutrition recommendations specifically to your pet
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsPetModalOpen(false);
              setEditingPet(null);
            }}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Species Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Pet Type *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setSpecies('dog');
                  setImage(dogPresets[0]);
                }}
                className={`py-3 px-4 rounded-2xl border-2 flex items-center justify-center gap-2.5 font-bold text-sm transition-all ${
                  species === 'dog'
                    ? 'border-[#4A154B] bg-purple-50 text-[#4A154B]'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <Dog className="w-5 h-5" />
                Dog 🐕
              </button>

              <button
                type="button"
                onClick={() => {
                  setSpecies('cat');
                  setImage(catPresets[0]);
                }}
                className={`py-3 px-4 rounded-2xl border-2 flex items-center justify-center gap-2.5 font-bold text-sm transition-all ${
                  species === 'cat'
                    ? 'border-[#4A154B] bg-purple-50 text-[#4A154B]'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <Cat className="w-5 h-5" />
                Cat 🐈
              </button>
            </div>
          </div>

          {/* Name & Breed */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Pet Name *
              </label>
              <input
                id="pet-name-input"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Bruno, Luna"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#4A154B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Breed
              </label>
              <input
                id="pet-breed-input"
                type="text"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                placeholder={species === 'dog' ? "e.g. Labrador, Beagle" : "e.g. British Shorthair, Persian"}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#4A154B]"
              />
            </div>
          </div>

          {/* Age & Life Stage */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Age
              </label>
              <input
                type="text"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 3 years, 8 months"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#4A154B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Life Stage
              </label>
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-[#4A154B]"
              >
                <option value={species === 'dog' ? 'puppy' : 'kitten'}>{species === 'dog' ? 'Puppy (0-1 yr)' : 'Kitten (0-1 yr)'}</option>
                <option value="adult">Adult (1-7 yrs)</option>
                <option value="senior">Senior (7+ yrs)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-[#4A154B]"
              >
                <option value="male">Male ♂</option>
                <option value="female">Female ♀</option>
              </select>
            </div>
          </div>

          {/* Weight & Activity Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Weight (kg)
              </label>
              <input
                type="number"
                min="0.5"
                max="100"
                step="0.5"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 1)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#4A154B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Activity Level
              </label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-[#4A154B]"
              >
                <option value="low">Low (Couch potato / Indoor)</option>
                <option value="moderate">Moderate (Daily walks / Play)</option>
                <option value="high">High (Energetic / Working / Trail)</option>
              </select>
            </div>
          </div>

          {/* Dietary Preferences */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Dietary Focus
            </label>
            <select
              value={dietaryPreference}
              onChange={(e) => setDietaryPreference(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-[#4A154B]"
            >
              <option value="regular">Regular Balanced Everyday Diet</option>
              <option value="grain_free">100% Grain-Free</option>
              <option value="sensitive">Sensitive Digestion & Stomach</option>
              <option value="high_protein">High-Protein & Muscle Building</option>
              <option value="weight_management">Weight Management & Low Calorie</option>
              <option value="hypoallergenic">Hypoallergenic (Single Novel Protein)</option>
            </select>
          </div>

          {/* Food Sensitivities & Allergies */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Food Sensitivities / Allergies (Optional)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={sensitivityInput}
                onChange={(e) => setSensitivityInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSensitivityTag(sensitivityInput);
                  }
                }}
                placeholder="e.g. Chicken, Beef, Dairy, Grain"
                className="flex-1 px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#4A154B]"
              />
              <button
                type="button"
                onClick={() => addSensitivityTag(sensitivityInput)}
                className="px-3.5 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200"
              >
                Add
              </button>
            </div>

            {/* Sensitivities quick pills */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {['Chicken', 'Beef', 'Dairy', 'Wheat', 'Corn', 'Soy'].map(quickTag => (
                <button
                  type="button"
                  key={quickTag}
                  onClick={() => addSensitivityTag(quickTag)}
                  className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                    foodSensitivities.includes(quickTag)
                      ? 'bg-amber-100 border-amber-300 text-amber-800 font-bold'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  +{quickTag}
                </button>
              ))}
            </div>

            {/* Selected Tags list */}
            {foodSensitivities.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2 border-t border-gray-100">
                {foodSensitivities.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200"
                  >
                    No {tag}
                    <button
                      type="button"
                      onClick={() => removeSensitivityTag(tag)}
                      className="hover:text-rose-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Pet Avatar Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Profile Photo
            </label>
            <div className="flex items-center gap-3">
              {(species === 'dog' ? dogPresets : catPresets).map((presetUrl, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setImage(presetUrl)}
                  className={`relative w-14 h-14 rounded-2xl overflow-hidden border-2 transition-all ${
                    image === presetUrl ? 'border-[#4A154B] ring-2 ring-[#4A154B]/30 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={presetUrl} alt="Preset" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setIsPetModalOpen(false);
                setEditingPet(null);
              }}
              className="px-5 py-2.5 rounded-xl text-gray-600 text-sm font-semibold hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              id="save-pet-profile-btn"
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#4A154B] text-white text-sm font-bold hover:bg-[#3B1443] transition-all shadow-md shadow-purple-950/10 active:scale-[0.98]"
            >
              {editingPet ? 'Update Pet Profile' : 'Save & Get Recommendations'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
