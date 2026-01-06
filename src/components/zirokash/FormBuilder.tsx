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
import { Checkbox } from "@/components/ui/checkbox";

interface FormField {
  id: string;
  type: "text" | "email" | "dropdown" | "amount";
  label: string;
  required: boolean;
  options?: string[];
  defaultValue?: string;
  isFixed?: boolean;
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
    const newId = `field-${Date.now()}`;
    const newField: FormField = {
      id: newId,
      type,
      label: `New ${type} field`,
      required: false,
      options: type === "dropdown" ? ["Option 1"] : undefined,
    };
    onFieldsChange([...fields, newField]);
    setEditingField(newId);
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
                <Card className="border-dashed border-2">
                  <CardContent className="py-12 text-center">
                    <div className="space-y-3">
                      <div className="text-4xl mb-4">📝</div>
                      <p className="text-muted-foreground font-medium">No fields yet</p>
                      <p className="text-sm text-muted-foreground">
                        Click the buttons above to add fields to your form
                      </p>
                      <div className="flex flex-wrap justify-center gap-2 mt-4">
                        <Badge variant="outline" className="text-xs">💡 Tip: Start with Amount field</Badge>
                        <Badge variant="outline" className="text-xs">📧 Add Email to send receipts</Badge>
                        <Badge variant="outline" className="text-xs">👤 Add Name to identify payers</Badge>
                      </div>
                    </div>
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
                                    <div className="space-y-4 pt-2">
                                      <div className="flex items-center justify-between p-3 border rounded-lg bg-primary/5 border-primary/20">
                                        <div className="space-y-0.5">
                                          <Label className="text-xs font-bold uppercase tracking-tight">Fixed Payment Amount</Label>
                                          <p className="text-[10px] text-muted-foreground italic">Payers cannot change this amount</p>
                                        </div>
                                        <Checkbox
                                          id={`fixed-${field.id}`}
                                          checked={field.isFixed}
                                          onCheckedChange={(checked) =>
                                            updateField(field.id, { isFixed: checked as boolean })
                                          }
                                        />
                                      </div>
                                      
                                      <div>
                                        <Label className="text-xs font-bold uppercase tracking-tight text-muted-foreground mb-1 block">Default Amount (₵)</Label>
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
                                    </div>
                                  )}

                                  <div className="flex items-center gap-2 py-2">
                                    <Checkbox
                                      id={`required-${field.id}`}
                                      checked={field.required}
                                      onCheckedChange={(checked) =>
                                        updateField(field.id, {
                                          required: checked as boolean,
                                        })
                                      }
                                    />
                                    <Label htmlFor={`required-${field.id}`} className="text-sm cursor-pointer">
                                      This is a required field
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
                                  className="group cursor-pointer space-y-2.5 p-4 rounded-xl hover:bg-muted/30 transition-all border-2 border-transparent hover:border-primary/30 bg-muted/10 shadow-sm"
                                  onClick={() => setEditingField(field.id)}
                                >
                                  <div className="flex items-center justify-between">
                                    <Label className="font-bold text-sm text-foreground cursor-pointer uppercase tracking-tight">{field.label}</Label>
                                    <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-wider bg-background opacity-70 group-hover:opacity-100 transition-opacity">
                                      {field.type}
                                    </Badge>
                                  </div>
                                  <div className="h-11 w-full rounded-lg border-2 border-dashed border-muted-foreground/30 bg-background/80 px-4 py-2 text-sm text-muted-foreground/60 flex items-center transition-colors group-hover:border-primary/40 group-hover:bg-background">
                                    {field.type === "amount" ? (
                                      <span className="font-medium">₵ 0.00</span>
                                    ) : (
                                      <span className="italic">Type {field.label.toLowerCase()} here...</span>
                                    )}
                                  </div>
                                  <div className="flex justify-center">
                                    <span className="text-[10px] font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                      <Plus className="h-3 w-3" /> Click to Edit Properties
                                    </span>
                                  </div>
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
