'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextInputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	className?: string;
	inputClassName?: string;
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
	({ label, className, inputClassName, ...props }, ref) => {
		return (
			<div className={cn('space-y-1', className)}>
				{label && (
					<label className="block text-sm font-medium mb-1">{label}</label>
				)}
				<input
					ref={ref}
					type="text"
					className={cn(
						'w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring',
						inputClassName
					)}
					{...props}
				/>
			</div>
		);
	}
);
TextInput.displayName = 'TextInput';

export { TextInput };
