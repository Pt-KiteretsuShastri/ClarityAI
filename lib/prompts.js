/* Prompt Templates for ClarityAI modes */

export const PROMPTS = {
  /**
   * Simplify prompt — rewrite web content to be easier to read
   * @param {string} text - Original content text
   * @returns {string} Formatted prompt
   */
  simplify(text) {
    return `You are an accessibility assistant. Rewrite the following web content to be easier to read and understand.

RULES:
- Use simple vocabulary (grade 5-6 reading level)
- Short sentences (max 20 words per sentence)
- Keep ALL facts, dates, names, and numbers exactly as they appear
- Explain difficult terms in parentheses right after the term
- Preserve the overall structure with headings where appropriate
- Break long paragraphs into shorter ones (2-3 sentences each)
- Use bullet points for lists or sequences
- Return ONLY the rewritten content, no introductory or concluding commentary
- Do NOT wrap the content in markdown code blocks

CONTENT TO REWRITE:
${text.slice(0, 4000)}`;
  },

  /**
   * Checklist prompt — extract key takeaways as a checklist
   * @param {string} text - Content to extract from
   * @returns {string} Formatted prompt
   */
  checklist(text) {
    return `Extract the most important key takeaways and action items from this text as a checklist.

RULES:
- Include 3-8 items
- Each item should be a single clear sentence
- Focus on actionable and important points only
- Return the items as a simple bullet list using dashes (-)
- No introductory text, no numbering, just the bullet list

TEXT:
${text.slice(0, 3000)}`;
  },

  /**
   * Explanation prompt — explain a concept simply
   * @param {string} concept - Concept to explain
   * @returns {string} Formatted prompt
   */
  explain(concept) {
    return `Explain the following concept in VERY simple terms. Pretend you're explaining to someone who has no background in this topic.

- Use everyday analogies
- Short sentences
- No jargon without explanation
- Keep it to 3-5 sentences max

CONCEPT: ${concept.slice(0, 500)}`;
  },
};
