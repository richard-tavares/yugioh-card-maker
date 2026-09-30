export function publicUrl(path: string): string {
    return `${import.meta.env.BASE_URL.replace(/\/$/, "")}/${path}`;
}
