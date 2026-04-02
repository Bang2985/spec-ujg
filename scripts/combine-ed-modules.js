#!/usr/bin/env node

/**
 * Script to combine all ed modules into a single properly sorted markdown file.
 * Uses topological sort based on dependencies defined in config.json files.
 */

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ED_DIR = join(__dirname, '../specs/ed');
const OUTPUT_FILE = join(__dirname, '../specs/ed-combined.md');

/**
 * Read config.json from a module directory
 */
async function readConfig(modulePath) {
    const configPath = join(modulePath, 'config.json');
    try {
        const content = await readFile(configPath, 'utf-8');
        return JSON.parse(content);
    } catch (e) {
        console.error(`Failed to read config from ${configPath}:`, e.message);
        return null;
    }
}

/**
 * Read index.md from a module directory
 */
async function readMarkdown(modulePath) {
    const mdPath = join(modulePath, 'index.md');
    try {
        return await readFile(mdPath, 'utf-8');
    } catch (e) {
        console.error(`Failed to read markdown from ${mdPath}:`, e.message);
        return null;
    }
}

/**
 * Recursively collect directories that contain a config.json file.
 */
async function collectModuleDirs(rootDir) {
    const entries = await readdir(rootDir, { withFileTypes: true });
    const moduleDirs = [];

    for (const entry of entries) {
        if (!entry.isDirectory()) continue;

        const entryPath = join(rootDir, entry.name);
        const config = await readConfig(entryPath);
        if (config) {
            moduleDirs.push(entryPath);
            continue;
        }

        moduleDirs.push(...await collectModuleDirs(entryPath));
    }

    return moduleDirs;
}

/**
 * Perform topological sort based on dependencies
 */
function topologicalSort(modules) {
    const sorted = [];
    const visited = new Set();
    const visiting = new Set();

    const moduleMap = new Map(modules.map(m => [m.id, m]));

    function visit(id) {
        if (visited.has(id)) return;
        if (visiting.has(id)) {
            throw new Error(`Circular dependency detected involving: ${id}`);
        }

        visiting.add(id);
        const module = moduleMap.get(id);
        if (module) {
            for (const dep of module.deps || []) {
                visit(dep);
            }
            visiting.delete(id);
            visited.add(id);
            sorted.push(module);
        }
    }

    for (const module of modules) {
        visit(module.id);
    }

    return sorted;
}

async function main() {
    console.log('🔍 Scanning ed modules...');

    // Read all module directories recursively
    const moduleDirs = await collectModuleDirs(ED_DIR);

    console.log(`📁 Found ${moduleDirs.length} modules: ${moduleDirs.map(dir => dir.replace(`${ED_DIR}/`, '')).join(', ')}`);

    // Load configs and markdown for each module
    const modules = [];
    for (const modulePath of moduleDirs) {
        const config = await readConfig(modulePath);
        const markdown = await readMarkdown(modulePath);

        if (config && markdown) {
            modules.push({
                id: config.id || modulePath.replace(`${ED_DIR}/`, ''),
                deps: config.deps || [],
                path: modulePath,
                markdown: markdown.trim()
            });
        }
    }

    console.log(`✅ Loaded ${modules.length} modules successfully`);

    // Sort modules by dependencies
    console.log('🔀 Sorting modules by dependencies...');
    const sorted = topologicalSort(modules);
    console.log(`📋 Sort order: ${sorted.map(m => m.id).join(' → ')}`);

    // Combine markdown
    const header = `# UJG Specification - Editor's Draft

> This document is an automatically generated combined view of all ed modules.
> Generated on: ${new Date().toISOString()}

---

## Table of Contents

${sorted.map((m, i) => `${i + 1}. [${m.id.charAt(0).toUpperCase() + m.id.slice(1)}](#${m.id})`).join('\n')}

---

`;

    const combinedContent = sorted.map(m => {
        return `<a id="${m.id}"></a>\n\n${m.markdown}`;
    }).join('\n\n---\n\n');

    const output = header + combinedContent;

    // Write output
    await writeFile(OUTPUT_FILE, output, 'utf-8');
    console.log(`\n✨ Combined markdown written to: ${OUTPUT_FILE}`);
    console.log(`📄 Total size: ${(output.length / 1024).toFixed(2)} KB`);
}

main().catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});
