import React from 'react';
import { CourseCategory } from '../types';
import { BookOpen, Rocket, Pencil, Puzzle, Lightbulb, Trophy } from 'lucide-react';

interface CourseCardProps {
  category: CourseCategory;
}

const CourseCard: React.FC<CourseCardProps> = ({ category }) => {
  const getIcon = () => {
    switch (category.name) {
      case 'Starter': return Puzzle;
      case 'Jumper': return Rocket;
      case 'Basic': return Pencil;
      case 'Intermediate': return BookOpen;
      case 'Advanced': return Lightbulb;
      case 'Elite': return Trophy;
      default: return BookOpen;
    }
  };

  const Icon = getIcon();

  return (
    <div className={`rounded-3xl overflow-hidden shadow-lg border-2 ${category.borderColor} bg-white transform transition-transform duration-300 hover:-translate-y-2 flex flex-col h-full`}>
      {/* Header */}
      <div className={`${category.themeColor} p-4 flex items-center justify-between text-white`}>
        <div className="flex items-center gap-2">
          <Icon size={24} className="text-white/90" />
          <h3 className="text-2xl bubble-font tracking-wide">{category.name}</h3>
        </div>
        <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full uppercase tracking-wider border border-white/20">
          4 Levels
        </span>
      </div>

      {/* Body */}
      <div className={`p-4 flex-grow ${category.bgGradient}`}>
        <div className="grid gap-4">
          {category.levels.map((levelData) => (
            <div 
              key={levelData.level} 
              className="bg-white/95 rounded-xl p-3 border border-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center mb-2 border-b border-dashed border-gray-200 pb-2">
                {/* Level Badge */}
                <div className={`h-7 px-4 rounded-full flex items-center justify-center text-xs font-black uppercase tracking-wider text-white ${category.themeColor} shadow-sm min-w-[85px] whitespace-nowrap`}>
                  LEVEL {levelData.level}
                </div>
                <span className="text-xl font-black text-gray-800">
                  ${levelData.total.toFixed(2)}
                </span>
              </div>
              
              <div className="text-xs text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>Tuition (45h):</span>
                  <span className="font-medium">${levelData.pricePerTerm}</span>
                </div>
                <div className={`flex justify-between ${levelData.tablets > 0 ? 'text-red-500 font-bold' : ''}`}>
                  <span>Tablet Fee:</span>
                  <span>
                    {levelData.tablets > 0 ? `$${levelData.tablets}` : 'Included'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Software:</span>
                  <span className="font-medium">${levelData.software}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white p-3 text-center border-t border-gray-100">
        <p className="text-xs text-gray-400 font-medium">
          Prices are per term (45 hours)
        </p>
      </div>
    </div>
  );
};

export default CourseCard;