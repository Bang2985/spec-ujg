import { readFileSync } from "node:fs";
import {
    type Document,
} from "@openuji/speculator";

import { buildWorkspaces } from "@openuji/speculator";


export const getDocuments = async (): Promise<Document[]> => {
    const workspaceContent = readFileSync('ujg.workspace.json', 'utf-8');
    const workspaceConfig = JSON.parse(workspaceContent);

    const result = await buildWorkspaces(workspaceConfig);

    return result.workspaces.ed.documents;
}

export const loadDocument = async (spec: string) => {
    const docs = await getDocuments();
    return docs.find((doc: Document) => doc.id === spec);
}