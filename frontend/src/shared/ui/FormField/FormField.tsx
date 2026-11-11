import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  id: string;
  label: string;
  error?: string | false;
  type?: string;
  multiline?: boolean;
  className?: string;
  rows?: number;

  [key: string]: any;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  error,
  type = 'text',
  multiline = false,
  className,
  rows = 4,
  ...props
}) => {
  const inputProps = {
    id,
    type,
    className: cn(error && 'border-red-500', className),
    ...props,
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {multiline ? <Textarea {...inputProps} rows={rows} /> : <Input {...inputProps} />}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
