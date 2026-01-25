import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Sparkles, TrendingUp, Grid3x3, List } from "lucide-react";
import { 
  FORM_TEMPLATES, 
  TEMPLATE_CATEGORIES, 
  FormTemplate,
  getFeaturedTemplates,
  searchTemplates,
  getTemplatesByCategory 
} from "@/data/formTemplates";
import { cn } from "@/lib/utils";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface TemplateGalleryProps {
  onSelectTemplate: (template: FormTemplate) => void;
  selectedTemplateId?: string | null;
}

export function TemplateGallery({ onSelectTemplate, selectedTemplateId }: TemplateGalleryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const getFilteredTemplates = () => {
    if (searchQuery.trim()) {
      return searchTemplates(searchQuery);
    }
    
    if (selectedCategory === "all") {
      return FORM_TEMPLATES;
    }
    
    if (selectedCategory === "featured") {
      return getFeaturedTemplates();
    }
    
    return getTemplatesByCategory(selectedCategory);
  };

  const filteredTemplates = getFilteredTemplates();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg sm:text-xl font-semibold mb-2">
          Choose Your Template
        </h3>
        <p className="text-sm text-muted-foreground">
          Select a pre-built template or start from scratch
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex border rounded-md">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
            className="rounded-r-none"
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
            className="rounded-l-none border-l"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="w-full h-auto flex-wrap justify-start gap-1 p-1">
          <TabsTrigger value="all" className="gap-1.5">
            ✨ All
          </TabsTrigger>
          <TabsTrigger value="featured" className="gap-1.5">
            <TrendingUp className="h-3 w-3" />
            Popular
          </TabsTrigger>
          {TEMPLATE_CATEGORIES.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="gap-1.5">
              {category.icon} {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          {/* Templates Grid/List */}
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No templates found</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div
              className={cn(
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "flex flex-col gap-3"
              )}
            >
              {filteredTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  isSelected={selectedTemplateId === template.id}
                  onClick={() => onSelectTemplate(template)}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface TemplateCardProps {
  template: FormTemplate;
  isSelected: boolean;
  onClick: () => void;
  viewMode: "grid" | "list";
}

function TemplateCard({ template, isSelected, onClick, viewMode }: TemplateCardProps) {
  const category = TEMPLATE_CATEGORIES.find((c) => c.id === template.category);

  if (viewMode === "list") {
    return (
      <Card
        className={cn(
          "cursor-pointer transition-all hover:border-primary hover:shadow-md",
          isSelected && "border-primary border-2 shadow-md ring-2 ring-primary/20"
        )}
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl flex-shrink-0">{template.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold truncate">{template.name}</h4>
                {template.isFeatured && (
                  <Badge variant="secondary" className="gap-1">
                    <Sparkles className="h-3 w-3" />
                    Popular
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {template.description}
              </p>
              {template.whenToUse && (
                <p className="text-xs text-primary/70 italic line-clamp-1 mt-1">
                  💡 {template.whenToUse}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  {category?.icon} {category?.name}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {template.fields.length} fields
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:border-primary hover:shadow-md group",
        isSelected && "border-primary border-2 shadow-md ring-2 ring-primary/20"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4 sm:p-5">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="text-3xl sm:text-4xl">{template.icon}</div>
            {template.isFeatured && (
              <Badge variant="secondary" className="gap-1 text-xs">
                <Sparkles className="h-3 w-3" />
                Popular
              </Badge>
            )}
          </div>

          {/* Content */}
          <div>
            <h4 className="font-semibold mb-1 text-sm sm:text-base">
              {template.name}
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
              {template.description}
            </p>
            {template.whenToUse && (
              <p className="text-xs text-primary/70 italic line-clamp-2 mt-1">
                💡 {template.whenToUse}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="pt-2 border-t flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              {category?.icon} {category?.name}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {template.fields.length === 0 ? "Custom" : `${template.fields.length} fields`}
            </span>
          </div>

          {/* Hover Preview */}
          {template.fields.length > 0 && (
            <div className="hidden group-hover:flex flex-wrap gap-1 pt-2 border-t">
              {template.fields.slice(0, 3).map((field, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {field.label}
                </Badge>
              ))}
              {template.fields.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{template.fields.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
