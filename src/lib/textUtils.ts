/**
 * Utility functions for text manipulation
 */

/**
 * Truncate text to specified length with ellipsis
 * @param text - The text to truncate
 * @param maxLength - Maximum length of the text
 * @param suffix - Suffix to add when text is truncated (default: '...')
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (!text || text.length <= maxLength) {
    return text
  }
  
  // Find the last space before maxLength to avoid cutting words
  const truncated = text.substring(0, maxLength)
  const lastSpaceIndex = truncated.lastIndexOf(' ')
  
  // If there's a space within reasonable distance, cut at the space
  if (lastSpaceIndex > maxLength * 0.8) {
    return truncated.substring(0, lastSpaceIndex) + suffix
  }
  
  // Otherwise, cut at maxLength
  return truncated + suffix
}

/**
 * Truncate text by word count
 * @param text - The text to truncate
 * @param maxWords - Maximum number of words
 * @param suffix - Suffix to add when text is truncated (default: '...')
 * @returns Truncated text
 */
export function truncateByWords(text: string, maxWords: number, suffix: string = '...'): string {
  if (!text) return text
  
  const words = text.split(' ')
  if (words.length <= maxWords) {
    return text
  }
  
  return words.slice(0, maxWords).join(' ') + suffix
}

/**
 * Check if text needs truncation
 * @param text - The text to check
 * @param maxLength - Maximum length
 * @returns Boolean indicating if text needs truncation
 */
export function needsTruncation(text: string, maxLength: number): boolean {
  return Boolean(text && text.length > maxLength)
}