export const setupDocumentMeta = (): void => {
  document.title = 'Fetch Dog Shelter';
  const link = document.head.querySelector<HTMLLinkElement>('link[rel="icon"]') || 
               document.createElement('link');
  link.rel = 'icon';
  link.href = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%235b4b8a" d="M4.5 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 0c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm-4.5 0c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm-5.3-4.3c-.4.4-.7 1.1-.7 1.8v7c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-7c0-.7-.3-1.4-.7-1.8L12 2l-8.3 5.7zM12 4.2l5.5 3.8c.2.1.3.4.3.7v7c0 .6-.4 1-1 1H7.2c-.6 0-1-.5-1-1v-7c0-.3.1-.6.3-.7L12 4.2z"/></svg>';
  document.head.appendChild(link);
}; 