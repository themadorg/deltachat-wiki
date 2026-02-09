/**
 * Safe clipboard write with fallback for webxdc / restricted environments.
 * 
 * In webxdc, navigator.clipboard.writeText() is blocked by CSP.
 * Falls back to the legacy document.execCommand('copy') approach.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    // Try modern API first
    if (navigator.clipboard?.writeText) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch {
            // Permission denied — fall through to legacy
        }
    }

    // Fallback: hidden textarea + execCommand
    try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.cssText = 'position:fixed;opacity:0;left:-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(textarea);
        return ok;
    } catch {
        return false;
    }
}
