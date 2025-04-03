import { useEffect, useState } from "react";
import { getFungi } from "../../domain/services/FungusService";
import { seaStormColors } from "../../utils/colors";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface MushroomSelectorProps {
  selectedMushroom: string;
  onSelectMushroom: (mushroom: string) => void;
}

export function MushroomSelector({ selectedMushroom, onSelectMushroom }: MushroomSelectorProps) {
  const [fungi, setFungi] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchFungi = async () => {
      try {
        const data = await getFungi();
        setFungi(data.map(fungus => ({ id: fungus.id, name: fungus.name })));
      } catch (error) {
        console.error("Error loading fungi", error);
      }
    };
    fetchFungi();
  }, []);

  return (
    <div className="flex items-center space-x-4">
      <label htmlFor="mushroom-select" className="text-lg font-medium" style={{ color: seaStormColors.blue.dark }}>
        Mushroom Type:
      </label>
      <Select value={selectedMushroom} onValueChange={onSelectMushroom}>
        <SelectTrigger id="mushroom-select" className="w-[200px] border border-gray-300 rounded-md px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <SelectValue placeholder="Select a mushroom" />
        </SelectTrigger>
        <SelectContent>
          {fungi.length > 0 ? (
            fungi.map((fungus) => (
              <SelectItem key={fungus.id} value={fungus.name}>
                {fungus.name}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="none" disabled>
              No mushrooms available
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}

