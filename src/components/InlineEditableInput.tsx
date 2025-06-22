import React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useInlineEdit } from '@/hooks/useInlineEdit';
import { Check } from 'lucide-react';

interface InlineEditableInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onSave: (value: string) => Promise<void> | void;
  error?: string;
}

const InlineEditableInput: React.FC<InlineEditableInputProps> = ({
  value: initial,
  onSave,
  className,
  error,
  ...props
}) => {
  const { value, setValue, editing, startEditing, handleBlur, handleKeyDown, saved } = useInlineEdit(initial, onSave);

  return editing ? (
    <div className="relative space-y-1">
      <Input
        {...props}
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(className, error && 'border-red-500')}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      {saved && (
        <Check
          className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500"
          size={16}
        />
      )}
    </div>
  ) : (
    <span onDoubleClick={startEditing} className="cursor-pointer">
      {initial || '—'}
    </span>
  );
};

export default InlineEditableInput;
