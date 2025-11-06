import { nanoid } from 'nanoid';
import { BaseService } from './BaseService';

export class FormApiKeyService extends BaseService {
  private static instance: FormApiKeyService;

  public static getInstance(): FormApiKeyService {
    return BaseService.getInstance.call(this) as FormApiKeyService;
  }

  public async generateApiKey(formId: string, userId: string) {
    const apiKey = `ziro_${nanoid(32)}`;
    
    const { data, error } = await this.supabase
      .from('form_api_keys')
      .insert({
        form_id: formId,
        user_id: userId,
        api_key: apiKey,
        status: 'active'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  public async getFormApiKey(formId: string) {
    const { data, error } = await this.supabase
      .from('form_api_keys')
      .select('*')
      .eq('form_id', formId)
      .eq('status', 'active')
      .single();

    if (error) throw error;
    return data;
  }

  public async revokeApiKey(apiKeyId: string) {
    const { error } = await this.supabase
      .from('form_api_keys')
      .update({ status: 'revoked' })
      .eq('id', apiKeyId);

    if (error) throw error;
  }
}