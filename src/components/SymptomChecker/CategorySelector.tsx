import React from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SymptomCategory } from '@/types/symptom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

interface CategorySelectorProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  categories: SymptomCategory[];
  getCategoryCount: (categoryId: string) => number;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ 
  categories, 
  activeCategory, 
  onCategoryChange,
  getCategoryCount
}) => { 
  const { t, language } = useLanguage();

  return (
    <div className="w-full">
      {/* Mobile dropdown (visible on small screens) */}
      <div className="block md:hidden mb-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full justify-between"
            >
              {(() => {
                const cat = categories.find(cat => cat.id === activeCategory);
                if (!cat) return t('symptom.category.select');
                return language === 'th' ? cat.name : (cat.name_en || cat.name);
              })()}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full">
            {categories.map((category) => (
              <DropdownMenuItem 
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={activeCategory === category.id ? "bg-medical-blue/10" : ""}
              >
                {language === 'th' ? category.name : (category.name_en || category.name)} ({getCategoryCount(category.id)})
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop horizontal scrolling (hidden on small screens) */}
      <div className="hidden md:block">
        <ScrollArea className="w-full pb-4">
          <div className="flex space-x-2 pb-2 overflow-x-auto">
            {categories.map((category: SymptomCategory) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                className={`whitespace-nowrap ${activeCategory === category.id ? "bg-medical-blue" : ""}`}
                onClick={() => onCategoryChange(category.id)}
              >
                {language === 'th' ? category.name : (category.name_en || category.name)} ({getCategoryCount(category.id)})
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default CategorySelector;