import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useFormApiKey } from '@/hooks/useFormApiKey';
import { useToast } from '@/hooks/use-toast';

interface ApiKeyManagementProps {
  formId: string;
}

export function ApiKeyManagement({ formId }: ApiKeyManagementProps) {
  const { apiKey, isLoading, isGenerating, isRevoking, generateApiKey, revokeApiKey } = useFormApiKey(formId);
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyApiKey = async () => {
    if (!apiKey) return;
    
    try {
      await navigator.clipboard.writeText(apiKey.key);
      setCopied(true);
      toast({
        title: 'API Key Copied',
        description: 'The API key has been copied to your clipboard.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy API key to clipboard.',
        variant: 'destructive',
      });
    }
  };

  const handleGenerateApiKey = () => {
    generateApiKey();
  };

  const handleRevokeApiKey = () => {
    if (!apiKey) return;
    revokeApiKey(apiKey.id);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">API Key Management</h3>
      
      {apiKey ? (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={apiKey.key}
              readOnly
              type="password"
              className="font-mono"
            />
            <Button
              onClick={handleCopyApiKey}
              variant="secondary"
              disabled={copied}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          
          <Alert>
            <AlertDescription>
              Keep this API key secure. If compromised, revoke it immediately and generate a new one.
            </AlertDescription>
          </Alert>

          <Button
            onClick={handleRevokeApiKey}
            variant="destructive"
            disabled={isRevoking}
            className="w-full"
          >
            {isRevoking ? 'Revoking...' : 'Revoke API Key'}
          </Button>
        </div>
      ) : (
        <Button
          onClick={handleGenerateApiKey}
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? 'Generating...' : 'Generate API Key'}
        </Button>
      )}
    </Card>
  );
}