export async function getCsrfToken(): Promise<string> {
    const response = await fetch('/sanctum/csrf-cookie');
    if (!response.ok) throw new Error('Failed to get CSRF token');

    const csrfMeta = document.querySelector('meta[name="csrf-token"]');
    return csrfMeta?.getAttribute('content') || '';
}
