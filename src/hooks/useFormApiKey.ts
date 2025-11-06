import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FormApiKeyService } from '@/services/FormApiKeyService';
import { useAuth } from './useAuth';

export function useFormApiKey(formId: string) {
  const queryClient = useQueryClient();
  const apiKeyService = FormApiKeyService.getInstance();
  const { user } = useAuth();

  const { data: apiKey, isLoading } = useQuery({
    queryKey: ['formApiKey', formId],
    queryFn: () => apiKeyService.getFormApiKey(formId),
    enabled: !!formId
  });

  const { mutate: generateApiKey, isPending: isGenerating } = useMutation({
    mutationFn: () => {
      if (!user?.id) throw new Error('User not authenticated');
      return apiKeyService.generateApiKey(formId, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formApiKey', formId] });
    }
  });

  const { mutate: revokeApiKey, isPending: isRevoking } = useMutation({
    mutationFn: (apiKeyId: string) => apiKeyService.revokeApiKey(apiKeyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formApiKey', formId] });
    }
  });

  return {
    apiKey,
    isLoading,
    isGenerating,
    isRevoking,
    generateApiKey,
    revokeApiKey
  };
}