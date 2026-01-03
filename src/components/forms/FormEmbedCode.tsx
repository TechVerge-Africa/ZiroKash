import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface FormEmbedCodeProps {
  formId: string;
  apiKey: string;
}

export function FormEmbedCode({ formId, apiKey }: FormEmbedCodeProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const embedCode = `<script src="https://cdn.zirokash.com/form-embed.js"></script>
<div id="zirokash-form-${formId}"></div>
<script>
  new ZiroKashForm({
    formId: "${formId}",
    apiKey: "${apiKey}",
    container: "#zirokash-form-${formId}"
  });
</script>`;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      toast({
        title: 'Embed Code Copied',
        description: 'The embed code has been copied to your clipboard.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy embed code to clipboard.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Embed Code</h3>
      
      <div className="space-y-4">
        <Alert>
          <AlertDescription>
            Copy and paste this code into your website where you want the form to appear.
          </AlertDescription>
        </Alert>

        <Textarea
          value={embedCode}
          readOnly
          className="font-mono h-[150px]"
        />

        <Button
          onClick={handleCopyCode}
          className="w-full"
          variant="secondary"
          disabled={copied}
        >
          {copied ? 'Copied!' : 'Copy Embed Code'}
        </Button>
      </div>
    </Card>
  );
}