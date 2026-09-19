import React from 'react';
import { Pet } from '../../types';
import { useStore } from '../../context/StoreContext';
import { Star, Edit3, Trash2, Activity, Scale, Heart, ShieldAlert } from 'lucide-react';

interface PetCardProps {
  pet: Pet;
  onEdit: (pet: Pet) => void;
}

export const PetCard: React.FC<PetCardProps> = ({ pet, onEdit }) => {
  const { activePet, setActivePet, setDefaultPet, deletePet } = useStore();
  const isActive = activePet?.id === pet.id;

  return (
    <div 
      id={`pet-card-${pet.id}`}
      className={`relative rounded-2xl border transition-all p-5 flex flex-col justify-between ${
        isActive 
          ? 'bg-gradient-to-b from-purple-50/80 to-white border-[#4A154B] shadow-md ring-2 ring-[#4A154B]/20' 
          : 'bg-white border-purple-100 hover:border-purple-200 shadow-xs'
      }`}
    >
      <div>
        {/* Header with image, name & default tag */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-purple-100 shrink-0 border-2 border-white shadow-xs">
              {pet.image ? (
                <img 
                  src={pet.image} 
                  alt={pet.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">
                  {pet.species === 'dog' ? '🐶' : '🐱'}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-900 leading-tight">{pet.name}</h3>
                {pet.isDefault && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-100 text-[#4A154B]">
                    Primary
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 capitalize">{pet.breed} • {pet.gender}</p>
              <p className="text-xs font-semibold text-gray-600 mt-0.5">{pet.age} old</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              id={`edit-pet-${pet.id}-btn`}
              onClick={() => onEdit(pet)}
              className="p-2 rounded-xl text-gray-400 hover:text-[#4A154B] hover:bg-purple-50 transition-colors"
              title="Edit pet details"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            {!pet.isDefault && (
              <button
                id={`delete-pet-${pet.id}-btn`}
                onClick={() => {
                  if (confirm(`Remove ${pet.name}'s profile?`)) {
                    deletePet(pet.id);
                  }
                }}
                className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Remove pet"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Nutritional & Bio Attributes */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-100 text-xs">
          <div className="flex items-center gap-2 text-gray-600">
            <Scale className="w-3.5 h-3.5 text-gray-400" />
            <span>Weight: <strong className="text-gray-900">{pet.weight} kg</strong></span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Activity className="w-3.5 h-3.5 text-gray-400" />
            <span>Activity: <strong className="text-gray-900 capitalize">{pet.activityLevel}</strong></span>
          </div>

          <div className="flex items-center gap-2 text-gray-600 col-span-2">
            <Heart className="w-3.5 h-3.5 text-[#FF6B4A]" />
            <span>Diet: <strong className="text-gray-900 capitalize">{pet.dietaryPreference.replace('_', ' ')}</strong></span>
          </div>

          {pet.foodSensitivities && pet.foodSensitivities.length > 0 && (
            <div className="flex items-start gap-2 text-gray-600 col-span-2">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <span className="text-xs">
                Sensitivities: <strong className="text-amber-700">{pet.foodSensitivities.join(', ')}</strong>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
        <button
          id={`select-active-pet-${pet.id}-btn`}
          onClick={() => setActivePet(pet)}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            isActive
              ? 'bg-[#4A154B] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-[#4A154B]'
          }`}
        >
          {isActive ? '✓ Active Shopping Profile' : `Shop for ${pet.name}`}
        </button>

        {!pet.isDefault && (
          <button
            onClick={() => setDefaultPet(pet.id)}
            className="p-2 rounded-xl text-gray-400 hover:text-amber-500 hover:bg-amber-50 transition-colors"
            title="Make Primary Default Pet"
          >
            <Star className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
