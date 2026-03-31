import { readFileSync } from 'node:fs';
import { type Document } from '@openuji/speculator';

import { buildWorkspaces } from '@openuji/speculator';

export type EditorDraftDocumentFamily = 'spec' | 'extension';

const FAMILY_ORDER: Record<EditorDraftDocumentFamily, number> = {
  spec: 0,
  extension: 1,
};

function getDocumentCustom(doc: Document): Record<string, unknown> {
  const custom = doc.metadata?.custom;
  return custom && typeof custom === 'object' ? (custom as Record<string, unknown>) : {};
}

export function getDocumentFamily(doc: Document): EditorDraftDocumentFamily {
  const family = getDocumentCustom(doc).family;
  return family === 'extension' ? 'extension' : 'spec';
}

export function getDocumentOrder(doc: Document): number {
  const order = Number(getDocumentCustom(doc).order);
  return Number.isFinite(order) ? order : Number.MAX_SAFE_INTEGER;
}

function compareDocuments(left: Document, right: Document): number {
  const familyDiff = FAMILY_ORDER[getDocumentFamily(left)] - FAMILY_ORDER[getDocumentFamily(right)];
  if (familyDiff !== 0) return familyDiff;

  const orderDiff = getDocumentOrder(left) - getDocumentOrder(right);
  if (orderDiff !== 0) return orderDiff;

  return (left.metadata?.title || left.id).localeCompare(right.metadata?.title || right.id);
}

export const getDocuments = async (): Promise<Document[]> => {
  const workspaceContent = readFileSync('ujg.workspace.json', 'utf-8');
  const entryMap = JSON.parse(workspaceContent);

  const result = await buildWorkspaces({ entryMap, env: import.meta.env });
  if (result.errors.length > 0) {
    console.error('Errors building workspaces:', result.errors);
  }
  return [...result.workspaces.ed.documents].sort(compareDocuments);
};

export const loadDocument = async (spec: string) => {
  const docs = await getDocuments();
  return docs.find((doc: Document) => doc.id === spec);
};
