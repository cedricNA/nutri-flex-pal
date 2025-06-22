import { useState } from 'react';

export function useInlineEdit(initial: string, onSave?: (value: string) => Promise<void> | void) {
  const [value, setValue] = useState(initial);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const startEditing = () => setEditing(true);
  const cancelEditing = () => {
    setValue(initial);
    setEditing(false);
  };

  const save = async () => {
    if (onSave) {
      await onSave(value);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setEditing(false);
  };

  const handleBlur = () => {
    if (editing) void save();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  return { value, setValue, editing, startEditing, handleBlur, handleKeyDown, saved };
}
