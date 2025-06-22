'use client';

import type React from 'react';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { TitleInput } from '@/components/ui/titleInput';
import { Edit2, Check, X } from 'lucide-react';
// import { updateNomikaiTitle } from '@/app/(pages)/group/[id]/schedule/actions';

interface EditableTitleProps {
	id: string;
	initialTitle: string;
	onTitleUpdate?: (newTitle: string) => void;
}

export async function updateNomikaiTitle(id: string, newTitle: string) {
	// 実際のアプリでは、ここでデータベースを更新
	console.log(`飲み会ID ${id} のタイトルを "${newTitle}" に更新`);

	// シミュレーション: データベース更新
	await new Promise((resolve) => setTimeout(resolve, 500));

	return { success: true, message: 'タイトルを更新しました' };
}

export function EditableTitle({
	id,
	initialTitle,
	onTitleUpdate,
}: EditableTitleProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [title, setTitle] = useState(initialTitle);
	const [tempTitle, setTempTitle] = useState(initialTitle);
	const [isUpdating, setIsUpdating] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (isEditing && inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, [isEditing]);

	const handleEdit = () => {
		setTempTitle(title);
		setIsEditing(true);
	};

	const handleCancel = () => {
		setTempTitle(title);
		setIsEditing(false);
	};

	const handleSave = async () => {
		if (tempTitle.trim() === '' || tempTitle === title) {
			handleCancel();
			return;
		}

		setIsUpdating(true);
		try {
			await updateNomikaiTitle(id, tempTitle.trim());
			setTitle(tempTitle.trim());
			setIsEditing(false);
			onTitleUpdate?.(tempTitle.trim());
		} catch (error) {
			console.error('タイトル更新エラー:', error);
		} finally {
			setIsUpdating(false);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleSave();
		} else if (e.key === 'Escape') {
			handleCancel();
		}
	};

	if (isEditing) {
		return (
			<div className="flex items-center gap-2">
				<TitleInput
					ref={inputRef}
					value={tempTitle}
					onChange={(e) => setTempTitle(e.target.value)}
					onKeyDown={handleKeyDown}
					className="text-xl font-bold"
					disabled={isUpdating}
				/>
				<Button
					size="sm"
					variant="ghost"
					onClick={handleSave}
					disabled={isUpdating}
				>
					<Check className="h-4 w-4" />
				</Button>
				<Button
					size="sm"
					variant="ghost"
					onClick={handleCancel}
					disabled={isUpdating}
				>
					<X className="h-4 w-4" />
				</Button>
			</div>
		);
	}

	return (
		<div className="flex items-center gap-2 group">
			<h3 className="text-xl font-bold">{title}</h3>
			<Button
				size="sm"
				variant="ghost"
				onClick={handleEdit}
				className="opacity-0 group-hover:opacity-100 transition-opacity"
			>
				<Edit2 className="h-4 w-4" />
			</Button>
		</div>
	);
}
