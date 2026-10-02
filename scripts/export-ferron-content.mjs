// Export the Ferron job post markdown exactly as the publisher would build it,
// so the database row can be repaired without duplicating the copy by hand.
import fs from 'node:fs';

const sourceUrl = 'https://tinyurl.com/StaffGA';
const companyUrl = 'https://www.ferron-pharma.com';

const script = fs.readFileSync('scripts/publish-ferron-ga-staff-job.mjs', 'utf8');
const match = script.match(/content: \[([\s\S]*?)\n  \]\.join/);
if (!match) throw new Error('content block not found in publisher script');

const lines = eval(`[${match[1]}]`);
const content = lines.join('\n');

if (!content.includes(sourceUrl)) throw new Error('sourceUrl missing from rebuilt content');
if (content.length < 500) throw new Error(`content suspiciously short: ${content.length}`);

fs.writeFileSync('/tmp/ferron_content.md', content);
console.log(JSON.stringify({ ok: true, length: content.length, hasFixedSentence: content.includes('ini bertugas menjaga') }));