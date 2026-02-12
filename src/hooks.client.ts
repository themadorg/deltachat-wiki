import type { HandleClientError } from '@sveltejs/kit';

// Handle chunk loading errors that happen after a new deployment
// When JS chunk hashes change, old chunks 404 and return HTML instead of JS
export const handleError: HandleClientError = ({ error, message }) => {
    // Detect chunk loading failures (MIME type mismatch = server returned HTML for .js request)
    const errorStr = String(error);
    if (
        errorStr.includes('Failed to fetch dynamically imported module') ||
        errorStr.includes('error loading dynamically imported module') ||
        errorStr.includes('Importing a module script failed') ||
        message?.includes('Not found')
    ) {
        // Force a full page reload to get the new deployment's chunks
        if (typeof window !== 'undefined') {
            window.location.reload();
            return; // unreachable but makes TS happy
        }
    }

    return {
        message: message || 'An unexpected error occurred'
    };
};
