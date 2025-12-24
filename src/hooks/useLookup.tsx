import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RecipientInfo {
  user_id: string;
  full_name: string;
  identifier_type: string;
  identifier_value: string;
  is_zirokash_user: boolean;
}

export function useLookup() {
  const [loading, setLoading] = useState(false);
  const [recipient, setRecipient] = useState<RecipientInfo | null>(null);

  const lookupRecipient = async (identifier: string) => {
    if (!identifier || identifier.trim() === '') {
      setRecipient(null);
      return { found: false, recipient: null };
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('lookup-recipient', {
        body: { identifier: identifier.trim() }
      });

      if (error) throw error;

      if (data?.found) {
        setRecipient(data.recipient);
        return { found: true, recipient: data.recipient };
      } else {
        setRecipient(null);
        return { found: false, recipient: null };
      }
    } catch (error: any) {
      console.error('Lookup error:', error);
      setRecipient(null);
      return { found: false, recipient: null, error };
    } finally {
      setLoading(false);
    }
  };

  const clearRecipient = () => {
    setRecipient(null);
  };

  return {
    lookupRecipient,
    clearRecipient,
    recipient,
    loading
  };
}
