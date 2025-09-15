function getCsrfToken() {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

interface ApiOptions extends Omit<RequestInit, 'body'> {
    body?: unknown;
}

export async function api<T = unknown>(
    url: string,
    { body, headers, ...options }: ApiOptions = {}
): Promise<T> {
    const mergedHeaders: HeadersInit = {
        'X-XSRF-TOKEN': getCsrfToken(),
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
    };

    const response = await fetch(url, {
        ...options,
        credentials: 'include',
        headers: mergedHeaders,
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return (await response.json()) as T;
    }
    return undefined as T;
}

export { getCsrfToken };
