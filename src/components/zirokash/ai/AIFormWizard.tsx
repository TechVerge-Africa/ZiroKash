import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Wand2, ArrowRight, AlertCircle, CheckCircle2, Loader2, Bot } from "lucide-react";
import { generateFormWithAI, generateBasicForm } from "@/services/aiFormGenerator";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FormField {
  id: string;
  type: "text" | "email" | "dropdown" | "amount";
  label: string;
  required: boolean;
  options?: string[];
  defaultValue?: string;
}

interface AIFormWizardProps {
  onGenerate: (formData: {
    title: string;
    description: string;
    fields: FormField[];
    themeColor: string;
    receiptHeader: string;
  }) => void;
  onSkip: () => void;
}

const EXAMPLE_PROMPTS = [
  "Simple payment for my store",
  "School fees with student ID and class",
  "Anonymous donation", 
  "Event tickets with VIP and regular options",
  "Hostel fees for students",
];

export function AIFormWizard({ onGenerate, onSkip }: AIFormWizardProps) {
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPreview, setGeneratedPreview] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast.error("Please describe what you want to collect");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedPreview(null);

    try {
      const result = await generateFormWithAI({
        description: description.trim(),
      });

      // Add IDs to fields
      const fieldsWithIds = result.fields.map((field, index) => ({
        ...field,
        id: `field-${Date.now()}-${index}`,
      }));

      setGeneratedPreview({
        ...result,
        fields: fieldsWithIds,
      });

      toast.success("Form generated successfully! Review and customize below.");
    } catch (err: any) {
      console.error("AI Generation Error:", err);
      
      // Try fallback
      try {
        const fallback = generateBasicForm(description.trim());
        const fieldsWithIds = fallback.fields.map((field, index) => ({
          ...field,
          id: `field-${Date.now()}-${index}`,
        }));

        setGeneratedPreview({
          ...fallback,
          fields: fieldsWithIds,
        });

        // Use success toast with info note instead of error
        toast.success("Form generated using smart template!");
        // Clear error so we don't show a red alert
        setError(null); 
      } catch (fallbackError) {
        setError(err.message || "Failed to generate form. Please try templates instead.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseGenerated = () => {
    if (generatedPreview) {
      onGenerate(generatedPreview);
    }
  };

  const fillExample = (prompt: string) => {
    setDescription(prompt);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Bot className="h-6 w-6 text-white" />
          </div>
        </div>
        <h3 className="text-xl font-semibold">AI Form Generator</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Describe what you want to collect and let AI generate a complete payment form
        </p>
      </div>

      {!generatedPreview ? (
        <>
          {/* Input Area */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Describe Your Payment Form</CardTitle>
              <CardDescription>
                Tell us what you want to collect. Be specific!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Just describe what you need! Examples:&#10;• 'payment for my shop'&#10;• 'school fees with student names'&#10;• 'donations for church'&#10;&#10;Keep it simple - AI will figure out the rest!"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="resize-none"
              />

              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  💡 Try these examples:
                </p>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_PROMPTS.map((prompt, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-xs"
                      onClick={() => fillExample(prompt)}
                    >
                      {prompt}
                    </Badge>
                  ))}
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !description.trim()}
                  className="flex-1 gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4" />
                      Generate Form
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={onSkip}
                  disabled={isGenerating}
                >
                  Use Templates
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Info Box */}
          <Alert>
            <Sparkles className="h-4 w-4" />
            <AlertDescription>
              <strong>Pro Tip:</strong> Be specific about what information you need to collect.
              Mention field types, options, and any special requirements.
            </AlertDescription>
          </Alert>
        </>
      ) : (
        <>
          {/* Preview Generated Form */}
          <Card className="border-primary">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <CardTitle className="text-base">Form Generated!</CardTitle>
                    {isGenerating === false && generatedPreview && !error && (
                      <Badge variant="outline" className="ml-2 text-xs font-normal text-muted-foreground">
                         Smart Template
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    Review the generated form below. You can customize it further after proceeding.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">{error}</AlertDescription>
                </Alert>
              )}

              {/* Form Preview */}
              <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Form Title</p>
                  <p className="font-semibold">{generatedPreview.title}</p>
                </div>
                
                {generatedPreview.description && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Description</p>
                    <p className="text-sm">{generatedPreview.description}</p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Fields ({generatedPreview.fields.length})
                  </p>
                  <div className="space-y-2">
                    {generatedPreview.fields.map((field: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 bg-background rounded border"
                      >
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {field.type}
                          </Badge>
                          <span className="text-sm">{field.label}</span>
                        </div>
                        {field.required && (
                          <Badge variant="outline" className="text-xs">
                            Required
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className="h-6 w-6 rounded"
                    style={{ backgroundColor: generatedPreview.themeColor }}
                  />
                  <p className="text-xs text-muted-foreground">Theme Color</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleUseGenerated}
                  className="flex-1 gap-2"
                >
                  Use This Form
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setGeneratedPreview(null);
                    setError(null);
                  }}
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
