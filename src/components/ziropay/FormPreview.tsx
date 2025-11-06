import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface FormField {
  id: string;
  type: "text" | "email" | "dropdown" | "amount";
  label: string;
  required: boolean;
  options?: string[];
  defaultValue?: string;
}

interface FormPreviewProps {
  title: string;
  description: string;
  fields: FormField[];
  themeColor: string;
  logoUrl?: string;
}

export function FormPreview({ title, description, fields, themeColor, logoUrl }: FormPreviewProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="border-2" style={{ borderColor: themeColor }}>
        <CardHeader className="text-center">
          {logoUrl && (
            <div className="mb-4 flex justify-center">
              <img src={logoUrl} alt="Logo" className="h-16 w-auto object-contain" />
            </div>
          )}
          <CardTitle className="text-2xl" style={{ color: themeColor }}>
            {title || "Untitled Form"}
          </CardTitle>
          {description && (
            <CardDescription className="mt-2">{description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No fields added yet</p>
            </div>
          ) : (
            <>
              {fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label>
                    {field.label}
                    {field.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  
                  {field.type === "text" && (
                    <Input placeholder={`Enter ${field.label.toLowerCase()}`} />
                  )}
                  
                  {field.type === "email" && (
                    <Input type="email" placeholder="email@example.com" />
                  )}
                  
                  {field.type === "dropdown" && field.options && (
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options.map((option, index) => (
                          <SelectItem key={index} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  
                  {field.type === "amount" && (
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        ₵
                      </span>
                      <Input
                        type="number"
                        className="pl-8"
                        placeholder={field.defaultValue || "0.00"}
                        defaultValue={field.defaultValue}
                      />
                    </div>
                  )}
                </div>
              ))}
              
              <Button 
                className="w-full mt-6" 
                style={{ backgroundColor: themeColor }}
              >
                Pay Now
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
