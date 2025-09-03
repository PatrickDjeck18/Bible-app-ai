/**
 * Utility functions for text formatting and cleanup
 */

/**
 * Removes markdown formatting from text
 * @param text - The text to clean
 * @returns Cleaned text without markdown formatting
 */
export function removeMarkdownFormatting(text: string): string {
  if (!text) return text;

  // Remove bold formatting (**text** or __text__)
  let cleanedText = text.replace(/\*\*(.*?)\*\*/g, '$1');
  cleanedText = cleanedText.replace(/__(.*?)__/g, '$1');
  
  // Remove italic formatting (*text* or _text_)
  cleanedText = cleanedText.replace(/\*(.*?)\*/g, '$1');
  cleanedText = cleanedText.replace(/_(.*?)_/g, '$1');
  
  // Remove strikethrough formatting (~~text~~)
  cleanedText = cleanedText.replace(/~~(.*?)~~/g, '$1');
  
  // Remove inline code formatting (`text`)
  cleanedText = cleanedText.replace(/`([^`]+)`/g, '$1');
  
  // Clean up any double spaces that might result from formatting removal
  cleanedText = cleanedText.replace(/\s+/g, ' ').trim();
  
  return cleanedText;
}

/**
 * Formats Bible verses for better readability
 * @param text - The text potentially containing Bible verses
 * @returns Text with improved Bible verse formatting
 */
export function formatBibleVerses(text: string): string {
  if (!text) return text;

  // Add proper spacing around Bible references
  // Match patterns like "John 3:16" or "1 Corinthians 13:4-7"
  let formattedText = text.replace(
    /([A-Z][a-z]+(?:\s+\d+)?)\s*(\d+:\d+(?:-\d+)?)/g, 
    '$1 $2'
  );
  
  return formattedText;
}

/**
 * Cleans and formats AI chat responses
 * @param text - The raw AI response text
 * @returns Cleaned and formatted text
 */
export function cleanAIResponse(text: string): string {
  if (!text) return text;

  // First remove markdown formatting
  let cleanedText = removeMarkdownFormatting(text);
  
  // Then format Bible verses
  cleanedText = formatBibleVerses(cleanedText);
  
  // Ensure proper paragraph spacing
  cleanedText = cleanedText.replace(/\n\s*\n/g, '\n\n');
  
  return cleanedText;
}