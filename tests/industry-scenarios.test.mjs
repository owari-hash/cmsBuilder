import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fixturesDir = path.join(__dirname, 'fixtures');
const expectedIndustries = new Set(['service', 'ecommerce', 'booking', 'blog']);

test('industry fixtures exist for all planned business models', () => {
  const files = fs.readdirSync(fixturesDir).filter((f) => f.endsWith('.json'));
  const industries = new Set();

  for (const file of files) {
    const payload = JSON.parse(fs.readFileSync(path.join(fixturesDir, file), 'utf8'));
    assert.ok(typeof payload.projectName === 'string' && payload.projectName.length > 0);
    assert.ok(Array.isArray(payload.pages) && payload.pages.length > 0);
    assert.ok(Array.isArray(payload.requiredFeatures) && payload.requiredFeatures.length > 0);
    industries.add(payload.industry);
  }

  for (const name of expectedIndustries) {
    assert.ok(industries.has(name), `missing fixture for ${name}`);
  }
});
