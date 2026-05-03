import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import {
	PUBLIC_SANITY_PROJECT_ID,
	PUBLIC_SANITY_DATASET
} from '$env/static/public';
import { schemaTypes } from './schemas';

export default defineConfig({
	basePath: '/studio',
	projectId: PUBLIC_SANITY_PROJECT_ID,
	dataset: PUBLIC_SANITY_DATASET,
	title: 'Clinica Sf. Gherasim — CMS',
	plugins: [structureTool(), visionTool()],
	schema: { types: schemaTypes }
});
