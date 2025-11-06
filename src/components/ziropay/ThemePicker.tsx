import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const PRESET_COLORS = [
  "#0056D2", // Ziro Blue
  "#00C389", // Success Green
  "#8B5CF6", // Purple
  "#EF4444", // Red
  "#F59E0B", // Amber
  "#10B981", // Emerald
  "#3B82F6", // Blue
  "#EC4899", // Pink
];

interface ThemePickerProps {
  color: string;
  onColorChange: (color: string) => void;
}

export function ThemePicker({ color, onColorChange }: ThemePickerProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Theme Color</Label>
        <p className="text-xs text-muted-foreground mt-1">
          Choose a color that matches your brand
        </p>
      </div>

      {/* Preset Colors */}
      <div className="grid grid-cols-8 gap-2">
        {PRESET_COLORS.map((presetColor) => (
          <button
            key={presetColor}
            className="h-10 w-10 rounded-md border-2 transition-all hover:scale-110"
            style={{
              backgroundColor: presetColor,
              borderColor: color === presetColor ? "#000" : "transparent",
            }}
            onClick={() => onColorChange(presetColor)}
            title={presetColor}
          />
        ))}
      </div>

      {/* Custom Color Picker */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Input
            type="text"
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
            placeholder="#0056D2"
            className="pr-12"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <input
              type="color"
              value={color}
              onChange={(e) => onColorChange(e.target.value)}
              className="h-8 w-8 rounded border cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="flex items-center gap-3 p-4 border rounded-lg">
        <div
          className="h-12 w-12 rounded"
          style={{ backgroundColor: color }}
        />
        <div className="flex-1">
          <p className="text-sm font-medium">Preview</p>
          <p className="text-xs text-muted-foreground">
            This color will be used for buttons and accents
          </p>
        </div>
      </div>
    </div>
  );
}
