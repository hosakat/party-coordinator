import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const eslintConfig = [
	{
		// ここでparserOptionsを指定
		parserOptions: {
			ecmaVersion: 2020,
			sourceType: 'module',
			project: './tsconfig.json',
			tsconfigRootDir: __dirname,
		},
	},
	...compat.extends('next/core-web-vitals', 'next/typescript'),
];

export default eslintConfig;
