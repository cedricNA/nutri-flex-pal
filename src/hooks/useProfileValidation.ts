import { useState } from 'react';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email({ message: 'Email invalide' }),
  age: z.string().optional().regex(/^\d*$/, 'Nombre uniquement'),
  weight: z.string().optional().regex(/^\d*(\.\d+)?$/, 'Nombre'),
  height: z.string().optional().regex(/^\d*(\.\d+)?$/, 'Nombre'),
  phone: z.string().optional(),
});

export type ProfileField = keyof z.infer<typeof schema>;
export type ProfileErrors = Partial<Record<ProfileField, string>>;

export function useProfileValidation() {
  const [errors, setErrors] = useState<ProfileErrors>({});

  const validateField = (field: ProfileField, value: string) => {
    try {
      schema.pick({ [field]: true } as any).parse({ [field]: value });
      setErrors((e) => ({ ...e, [field]: undefined }));
      return true;
    } catch (err) {
      setErrors((e) => ({ ...e, [field]: (err as any).issues?.[0]?.message || 'Invalide' }));
      return false;
    }
  };

  return { errors, validateField };
}
