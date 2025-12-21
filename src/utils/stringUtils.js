export const stripHtml = (html) => {
  if (!html) return '';
  let text = html.replace(/<br\s*\/?>/gi, ' ');
  text = text.replace(/<[^>]+>/g, '');
  text = text.replace(/\s+/g, ' ').trim();
  
  if (text.length > 160) {
      return text.substring(0, 160) + '...';
  }
  return text;
};