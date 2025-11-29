'use client';

import { useState, useEffect, useCallback } from 'react';

export interface UserPlanStatus {
    plan: 'free' | 'basic' | 'plus';
    planDisplay: string;
    usage: number;
    colouringCount: number;
    drawingCount: number;
    limit: number;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

/**
 * Hook to fetch and manage current user's plan status
 * Automatically fetches on mount and provides refetch function
 */
export function useUserPlan(): UserPlanStatus {
    const [data, setData] = useState<UserPlanStatus>({
        plan: 'free',
        planDisplay: 'Loading...',
        usage: 0,
        colouringCount: 0,
        drawingCount: 0,
        limit: 3,
        isLoading: true,
        error: null,
        refetch: async () => { },
    });

    const fetchPlanStatus = useCallback(async () => {
        try {
            setData(prev => ({ ...prev, isLoading: true, error: null }));

            const res = await fetch('/api/user/status');

            // Handle 401 (not authenticated) - show Free plan
            if (res.status === 401) {
                setData(prev => ({
                    ...prev,
                    plan: 'free',
                    planDisplay: 'Free (Not Signed In)',
                    usage: 0,
                    colouringCount: 0,
                    drawingCount: 0,
                    limit: 3,
                    isLoading: false,
                    error: null,
                }));
                return;
            }

            if (!res.ok) {
                throw new Error('Failed to fetch plan status');
            }

            const apiData = await res.json();

            // Format plan display name
            const planDisplay = apiData.plan
                ? apiData.plan.charAt(0).toUpperCase() + apiData.plan.slice(1)
                : 'Free';

            setData(prev => ({
                ...prev,
                plan: apiData.plan || 'free',
                planDisplay,
                usage: apiData.usage || 0,
                colouringCount: apiData.colouringCount || 0,
                drawingCount: apiData.drawingCount || 0,
                limit: apiData.limit || 3,
                isLoading: false,
                error: null,
            }));
        } catch (error: unknown) {
            console.error('Error fetching plan status:', error);
            const message = error instanceof Error ? error.message : 'Failed to load plan';
            // Fallback to Free plan on error
            setData(prev => ({
                ...prev,
                plan: 'free',
                planDisplay: 'Free',
                usage: 0,
                colouringCount: 0,
                drawingCount: 0,
                limit: 3,
                isLoading: false,
                error: message,
            }));
        }
    }, []);

    useEffect(() => {
        fetchPlanStatus();
    }, [fetchPlanStatus]);

    // Return data with refetch function
    return {
        ...data,
        refetch: fetchPlanStatus,
    };
}
