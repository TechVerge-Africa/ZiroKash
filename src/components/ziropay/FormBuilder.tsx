import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GripVertical, X, Plus, Mail, Type, DollarSign, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FormField {
  id: string;
  type: "text" | "email" | "dropdown" | "amount";
  label: string;
  required: boolean;
  options?: string[];
  defaultValue?: string;
}

interface FormBuilderProps {
  fields: FormField[];
  onFieldsChange: (fields: FormField[]) => void;
}

const FIELD_TYPES = [
  { type: "text" as const, icon: Type, label: "Text Field" },
  { type: "email" as const, icon: Mail, label: "Email Field" },
  { type: "dropdown" as const, icon: ChevronDown, label: "Dropdown" },
  { type: "amount" as const, icon: DollarSign, label: "Amount Field" },
];

export function FormBuilder({ fields, onFieldsChange }: FormBuilderProps) {
  const [editingField, setEditingField] = useState<string | null>(null);

  const addField = (type: FormField["type"]) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type,
      label: `New ${type} field`,
      required: false,
      options: type === "dropdown" ? ["Option 1"] : undefined,
    };
    onFieldsChange([...fields, newField]);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    onFieldsChange(
      fields.map((field) =>
        field.id === id ? { ...field, ...updates } : field
      )
    );
  };

  const removeField = (id: string) => {
    onFieldsChange(fields.filter((field) => field.id !== id));
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(fields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onFieldsChange(items);
  };

  const addDropdownOption = (fieldId: string) => {
    const field = fields.find((f) => f.id === fieldId);
    if (field && field.options) {
      updateField(fieldId, {
        options: [...field.options, `Option ${field.options.length + 1}`],
      });
    }
  };

  const updateDropdownOption = (fieldId: string, optionIndex: number, value: string) => {
    const field = fields.find((f) => f.id === fieldId);
    if (field && field.options) {
      const newOptions = [...field.options];
      newOptions[optionIndex] = value;
      updateField(fieldId, { options: newOptions });
    }
  };

  const removeDropdownOption = (fieldId: string, optionIndex: number) => {
    const field = fields.find((f) => f.id === fieldId);
    if (field && field.options && field.options.length > 1) {
      updateField(fieldId, {
        options: field.options.filter((_, i) => i !== optionIndex),
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Field Type Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {FIELD_TYPES.map((fieldType) => (
          <Button
            key={fieldType.type}
            variant="outline"
            className="gap-2 h-auto py-3"
            onClick={() => addField(fieldType.type)}
          >
            <fieldType.icon className="h-4 w-4" />
            <span className="text-xs">{fieldType.label}</span>
          </Button>
        ))}
      </div>

      {/* Form Fields */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="form-fields">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-3"
            >
              {fields.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="py-12 text-center text-muted-foreground">
                    <p>No fields yet. Add fields using the buttons above.</p>
                  </CardContent>
                </Card>
              ) : (
                fields.map((field, index) => (
                  <Draggable key={field.id} draggableId={field.id} index={index}>
                    {(provided) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="relative"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div
                              {...provided.dragHandleProps}
                              className="mt-2 cursor-grab active:cursor-grabbing"
                            >
                              <GripVertical className="h-5 w-5 text-muted-foreground" />
                            </div>

                            <div className="flex-1 space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary" className="text-xs">
                                    {field.type}
                                  </Badge>
                                  {field.required && (
                                    <Badge variant="outline" className="text-xs">
                                      Required
                                    </Badge>
                                  )}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeField(field.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>

                              {editingField === field.id ? (
                                <div className="space-y-3">
                                  <div>
                                    <Label>Field Label</Label>
                                    <Input
                                      value={field.label}
                                      onChange={(e) =>
                                        updateField(field.id, { label: e.target.value })
                                      }
                                      placeholder="Enter field label"
                                    />
                                  </div>

                                  {field.type === "dropdown" && field.options && (
                                    <div>
                                      <Label>Options</Label>
                                      <div className="space-y-2 mt-2">
                                        {field.options.map((option, optIndex) => (
                                          <div key={optIndex} className="flex gap-2">
                                            <Input
                                              value={option}
                                              onChange={(e) =>
                                                updateDropdownOption(
                                                  field.id,
                                                  optIndex,
                                                  e.target.value
                                                )
                                              }
                                              placeholder={`Option ${optIndex + 1}`}
                                            />
                                            {field.options && field.options.length > 1 && (
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                  removeDropdownOption(field.id, optIndex)
                                                }
                                              >
                                                <X className="h-4 w-4" />
                                              </Button>
                                            )}
                                          </div>
                                        ))}
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => addDropdownOption(field.id)}
                                          className="gap-2"
                                        >
                                          <Plus className="h-3 w-3" />
                                          Add Option
                                        </Button>
                                      </div>
                                    </div>
                                  )}

                                  {field.type === "amount" && (
                                    <div>
                                      <Label>Default Amount (₵)</Label>
                                      <Input
                                        type="number"
                                        value={field.defaultValue || ""}
                                        onChange={(e) =>
                                          updateField(field.id, {
                                            defaultValue: e.target.value,
                                          })
                                        }
                                        placeholder="Enter amount"
                                      />
                                    </div>
                                  )}

                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      id={`required-${field.id}`}
                                      checked={field.required}
                                      onChange={(e) =>
                                        updateField(field.id, {
                                          required: e.target.checked,
                                        })
                                      }
                                      className="rounded border-gray-300"
                                    />
                                    <Label htmlFor={`required-${field.id}`}>
                                      Required field
                                    </Label>
                                  </div>

                                  <Button
                                    size="sm"
                                    onClick={() => setEditingField(null)}
                                  >
                                    Done
                                  </Button>
                                </div>
                              ) : (
                                <div
                                  className="cursor-pointer"
                                  onClick={() => setEditingField(field.id)}
                                >
                                  <p className="font-medium">{field.label}</p>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    Click to edit
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
