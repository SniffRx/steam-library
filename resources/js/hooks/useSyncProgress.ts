import { useQuery } from '@tanstack/react-query';

interface SyncProgress {
    status: 'idle' | 'queued' | 'processing' | 'completed' | 'error';
    progress?: number;
    processed?: number;
    total?: number;
    completed?: number;
    errors?: number;
    message?: string;
    finished_at?: string;
}

export function useSyncProgress(enabled: boolean) {
    return useQuery<SyncProgress>({
        queryKey: ['sync-progress'],
        queryFn: async () => {
            const response = await fetch('/gameslist/sync-progress', {
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch sync progress');
            }

            return response.json();
        },
        refetchInterval: enabled ? 2000 : false,
        enabled,
    });
}
