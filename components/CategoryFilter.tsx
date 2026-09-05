import React from 'react';
import { Category } from '../types';
import { Utensils, Flame, Soup, Salad, Pizza } from 'lucide-react';

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame':
        return <Flame className="w-5 h-5" />;
      case 'Soup':
        return <Soup className="w-5 h-5" />;
      case 'Salad':
        return <Salad className="w-5 h-5" />;
      case 'Pizza':
        return <Pizza className="w-5 h-5" />;
      default:
        return <Utensils className="w-5 h-5" />;
    }
  };

  return (
    <div className="sticky top-20 z-30 bg-slate-50/90 backdrop-blur-md py-4 border-b border-slate-200/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
          {categories.map((category) => {
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all duration-200 shadow-sm ${
                  isActive
                    ? 'bg-arama-500 text-white shadow-lg shadow-arama-500/30 scale-105'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-arama-500'}>
                  {getIcon(category.iconName)}
                </span>
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
