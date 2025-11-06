import { ApiKeyManagement } from './ApiKeyManagement';
import { FormEmbedCode } from './FormEmbedCode';
import { useFormApiKey } from '@/hooks/useFormApiKey';

interface FormEmbedManagerProps {
  formId: string;
}

export function FormEmbedManager({ formId }: FormEmbedManagerProps) {
  const { apiKey, isLoading } = useFormApiKey(formId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <ApiKeyManagement formId={formId} />
      {apiKey && (
        <FormEmbedCode 
          formId={formId} 
          apiKey={apiKey.key}
        />
      )}
    </div>
  );
}