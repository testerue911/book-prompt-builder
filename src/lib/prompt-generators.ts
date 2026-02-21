import { Project } from '@/types/project';

export function generateBookPrompt(project: Project): string {
  const p = project;
  const b = p.bookPrompt;

  const lines: string[] = [];

  lines.push(`# BOOK WRITING PROMPT`);
  lines.push('');
  lines.push(`## ROLE`);
  lines.push(`You are a professional book author and content strategist specializing in ${p.bookCategory || 'non-fiction'} books. You write in ${p.language === 'IT' ? 'Italian' : 'English'}. Your writing is ${p.tone}, engaging, and tailored for the target audience.`);
  lines.push('');

  lines.push(`## PROJECT OVERVIEW`);
  lines.push(`- **Title**: ${p.title}`);
  lines.push(`- **Category**: ${p.bookCategory}`);
  lines.push(`- **Language**: ${p.language}`);
  lines.push(`- **Target Audience**: ${p.targetAudience}`);
  lines.push(`- **Unique Selling Point**: ${p.usp}`);
  lines.push(`- **Target Length**: ${p.targetLength}`);
  lines.push(`- **Tone**: ${p.tone}`);
  lines.push('');

  lines.push(`## MAIN IDEA`);
  lines.push(b.mainIdea);
  lines.push('');

  if (b.readerTransformation) {
    lines.push(`## READER TRANSFORMATION`);
    lines.push(`After reading this book, the reader should: ${b.readerTransformation}`);
    lines.push('');
  }

  if (b.keyPoints.length > 0) {
    lines.push(`## KEY POINTS TO INCLUDE`);
    b.keyPoints.forEach((pt, i) => lines.push(`${i + 1}. ${pt}`));
    lines.push('');
  }

  if (b.whatToAvoid.length > 0) {
    lines.push(`## WHAT TO AVOID`);
    b.whatToAvoid.forEach(a => lines.push(`- ❌ ${a}`));
    lines.push('');
  }

  lines.push(`## WRITING STYLE`);
  lines.push(`Style: ${b.writingStyle}${b.customStyle ? ` — ${b.customStyle}` : ''}`);
  if (b.writeLikeInspiration) {
    lines.push(`Inspiration: Write in a style similar to ${b.writeLikeInspiration}`);
  }
  lines.push('');

  if (b.chapters.length > 0) {
    lines.push(`## CHAPTER STRUCTURE`);
    b.chapters.forEach((ch, i) => {
      lines.push(`### Chapter ${i + 1}: ${ch.title}`);
      lines.push(ch.description);
    });
    lines.push('');
  } else if (b.autoGenerateOutline) {
    lines.push(`## STRUCTURE`);
    lines.push(`Auto-generate a logical chapter outline based on the main idea and key points above.`);
    lines.push('');
  }

  if (p.constraints.length > 0) {
    lines.push(`## CONSTRAINTS & COMPLIANCE`);
    p.constraints.forEach(c => lines.push(`- ⚠️ ${c}`));
    lines.push('');
  }

  lines.push(`## DESIRED OUTPUT`);
  lines.push(`Produce: ${p.desiredOutput}`);
  lines.push(`Format: ${b.outputFormat}`);
  lines.push('');

  lines.push(`## FORMATTING RULES`);
  lines.push(`- Use clear headings and subheadings`);
  lines.push(`- Keep paragraphs short and readable`);
  lines.push(`- Include transitions between sections`);
  lines.push(`- Use bullet points for lists when appropriate`);
  lines.push('');

  if (p.referenceImages.length > 0) {
    lines.push(`## REFERENCE IMAGES`);
    p.referenceImages.forEach(img => {
      lines.push(`- **${img.name}**: ${img.notes} [Tags: ${img.tags.join(', ')}]${img.isPrimary ? ' ⭐ PRIMARY' : ''}`);
    });
    lines.push('');
  }

  lines.push(`## FINAL VERIFICATION CHECKLIST`);
  lines.push(`Before delivering, verify:`);
  lines.push(`- [ ] Content matches the specified tone (${p.tone})`);
  lines.push(`- [ ] Target audience needs are addressed (${p.targetAudience})`);
  lines.push(`- [ ] All constraints are respected`);
  lines.push(`- [ ] Content length is appropriate (${p.targetLength})`);
  lines.push(`- [ ] No copyrighted material is used`);
  lines.push(`- [ ] Language is ${p.language === 'IT' ? 'Italian' : 'English'}`);

  return lines.join('\n');
}

export function generateCoverPrompt(project: Project): string {
  const c = project.coverPrompt;
  const lines: string[] = [];

  lines.push(`# BOOK COVER GENERATION PROMPT`);
  lines.push('');
  lines.push(`## IMAGE GENERATION PROMPT`);
  lines.push(`Create a ${c.visualStyle} style book cover illustration.`);
  lines.push(`Mood: ${c.mood}`);
  lines.push(`Main elements: ${c.mainElements}`);
  lines.push(`Color palette: ${c.colorPalette}`);
  lines.push(`Trim size: ${c.trimSize} inches`);
  lines.push('');

  lines.push(`## TYPOGRAPHY`);
  lines.push(`- Title: "${c.coverTitle || project.title}"`);
  if (c.coverSubtitle) lines.push(`- Subtitle: "${c.coverSubtitle}"`);
  if (c.authorName) lines.push(`- Author: "${c.authorName}"`);
  lines.push(`- Typography style: ${c.typographyStyle}`);
  lines.push('');

  lines.push(`## IMAGE + TYPOGRAPHY COMBINED PROMPT`);
  lines.push(`Design a complete ${c.trimSize}" book cover in ${c.visualStyle} style. The mood is ${c.mood}. Feature ${c.mainElements}. Use a ${c.colorPalette} color palette. Typography style: ${c.typographyStyle}. Title: "${c.coverTitle || project.title}"${c.coverSubtitle ? `, Subtitle: "${c.coverSubtitle}"` : ''}${c.authorName ? `, Author: "${c.authorName}"` : ''}.`);
  lines.push('');

  if (c.negativePrompt) {
    lines.push(`## NEGATIVE PROMPT (What to Avoid)`);
    lines.push(c.negativePrompt);
    lines.push('');
  }

  lines.push(`## KDP COVER SPECIFICATIONS`);
  lines.push(`- Trim size: ${c.trimSize}"`);
  lines.push(`- Resolution: 300 DPI minimum`);
  lines.push(`- Color space: RGB (convert to CMYK for print)`);
  lines.push(`- Bleed: 0.125" on all sides`);
  lines.push(`- Safe zone: Keep text 0.25" from trim edge`);

  return lines.join('\n');
}

export function generateInteriorPrompt(project: Project): string {
  const i = project.interiorPrompt;
  const lines: string[] = [];

  lines.push(`# INTERIOR DESIGN PROMPT`);
  lines.push('');
  lines.push(`## LAYOUT SPECIFICATIONS`);
  lines.push(`- Interior type: ${i.interiorType}`);
  lines.push(`- Page size: ${i.pageSize}"`);
  lines.push(`- Margins: ${i.margins}`);
  lines.push(`- Layout style: ${i.layoutStyle}`);
  lines.push('');

  if (i.recurringElements.length > 0) {
    lines.push(`## RECURRING ELEMENTS`);
    i.recurringElements.forEach(el => lines.push(`- ${el}`));
    lines.push('');
  }

  lines.push(`## DESIGN PROMPT`);
  lines.push(`Design the interior layout for a ${i.interiorType} (${i.pageSize}"). Style: ${i.layoutStyle}. Include: ${i.recurringElements.join(', ')}. Use ${i.margins} margins with proper bleed settings for KDP print.`);
  lines.push('');

  lines.push(`## KDP PRE-PUBLICATION CHECKLIST`);
  lines.push(`- [ ] Page size matches KDP requirements (${i.pageSize}")`);
  lines.push(`- [ ] Margins meet KDP minimum requirements`);
  lines.push(`- [ ] Bleed settings are correct (if applicable)`);
  lines.push(`- [ ] Fonts are embedded in PDF`);
  lines.push(`- [ ] Images are 300 DPI minimum`);
  lines.push(`- [ ] No content in bleed area`);
  lines.push(`- [ ] Page count is within KDP limits`);
  lines.push(`- [ ] File format: PDF/X-1a or PDF/X-3`);

  return lines.join('\n');
}

export function generateMetadataPack(project: Project): string {
  const m = project.metadata;
  const lines: string[] = [];

  lines.push(`# KDP METADATA PACK`);
  lines.push('');
  lines.push(`**Title**: ${m.title || project.title}`);
  lines.push(`**Subtitle**: ${m.subtitle}`);
  lines.push(`**BISAC Category**: ${m.bisacCategory}`);
  lines.push('');
  lines.push(`## Keywords`);
  m.keywords.forEach((kw, i) => lines.push(`${i + 1}. ${kw}`));
  lines.push('');
  lines.push(`## Description`);
  lines.push(m.description);
  lines.push('');
  lines.push(`## Bullet Points`);
  m.bulletPoints.forEach(bp => lines.push(`• ${bp}`));

  return lines.join('\n');
}
