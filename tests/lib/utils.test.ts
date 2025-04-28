import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn utility function', () => {
  it('combines class names correctly', () => {
    const result = cn('text-red-500', 'bg-blue-500', 'p-4');
    expect(result).toBe('text-red-500 bg-blue-500 p-4');
  });

  it('handles conditional class names', () => {
    const isActive = true;
    const isPrimary = false;
    
    const result = cn(
      'base-class',
      isActive && 'active-class',
      isPrimary && 'primary-class'
    );
    
    expect(result).toBe('base-class active-class');
    expect(result).not.toContain('primary-class');
  });

  it('handles array of class names', () => {
    const classes = ['text-sm', 'font-bold'];
    const result = cn('base', classes);
    
    expect(result).toBe('base text-sm font-bold');
  });

  it('handles tailwind conflicts with tailwind-merge', () => {
    const result = cn('text-red-500', 'text-blue-600');
    
    // tailwind-merge should resolve the conflict in favor of the last class
    expect(result).toBe('text-blue-600');
    expect(result).not.toContain('text-red-500');
  });

  it('handles empty or falsy inputs', () => {
    const result = cn('base-class', '', null, undefined, false, 0);
    
    expect(result).toBe('base-class');
  });
}); 