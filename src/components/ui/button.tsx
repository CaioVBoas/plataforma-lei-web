import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import { buttonClassName, type ButtonStyleOptions } from './buttonStyles';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonStyleOptions {}

export const Button = ({ variant, size, fullWidth, className, type = 'button', ...props }: ButtonProps) => (
  <button type={type} className={cn(buttonClassName({ variant, size, fullWidth }), className)} {...props} />
);
