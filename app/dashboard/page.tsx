'use client';

import React, { useState, useEffect } from 'react';
import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useUserPlan } from '@/hooks/useUserPlan';
import { Footer } from '@/components/landing/footer';
import jsPDF from 'jspdf';

interface Activity {
    id: string;
    childName: string;
    ageGroup: string;
    topic: string;
    activityType: string;
    title: string;
    content: string;
    imageBase64: string | null;
    createdAt: string;
}

export default function Dashboard() {
    const { signOut } = useClerk();
    const router = useRouter();
    const userPlan = useUserPlan();
    const [resettingUsage, setResettingUsage] = useState(false);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loadingActivities, setLoadingActivities] = useState(true);
    const [downloadingId, setDownloadingId] = useState<string | null>(null);

    // Fetch activities on mount
    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            const response = await fetch('/api/activities');
            const data = await response.json();
            if (data.activities) {
                setActivities(data.activities);
            }
        } catch (error) {
            console.error('Error fetching activities:', error);
        } finally {
            setLoadingActivities(false);
        }
    };

    // Feature 1: Proper sign out
    const handleSignOut = async () => {
        if (confirm('Sign out of your account?')) {
            try {
                await signOut();
                router.push('/sign-in');
            } catch (error) {
                console.error('Sign out error:', error);
                alert('Failed to sign out. Please try again.');
            }
        }
    };

    // Feature 4: DEV reset usage
    const handleResetUsage = async () => {
        if (!confirm('DEV: Reset your free plan usage?')) return;

        setResettingUsage(true);
        try {
            const response = await fetch('/api/dev/reset-usage', {
                method: 'POST',
            });

            const data = await response.json();

            if (response.ok) {
                alert(`✅ Usage reset! Deleted ${data.deletedCount} records.`);
                await userPlan.refetch();
            } else {
                throw new Error(data.error || 'Reset failed');
            }
        } catch (error: unknown) {
            console.error('Reset usage error:', error);
            const message = error instanceof Error ? error.message : 'Unknown error';
            alert(`Failed to reset usage: ${message}`);
        } finally {
            setResettingUsage(false);
        }
    };

    // Download PDF for an activity
    const downloadPDF = async (activity: Activity) => {
        setDownloadingId(activity.id);

        try {
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });
            
            const pageWidth = pdf.internal.pageSize.getWidth();
            const margin = 20;
            const contentWidth = pageWidth - (margin * 2);
            
            // Header
            pdf.setFontSize(10);
            pdf.setTextColor(150);
            pdf.text('SMARTPRINTS UK', margin, 15);
            pdf.text(formatDate(activity.createdAt), pageWidth - margin, 15, { align: 'right' });
            
            // Title
            pdf.setFontSize(24);
            pdf.setTextColor(49, 46, 129);
            const titleLines = pdf.splitTextToSize(activity.title, contentWidth);
            pdf.text(titleLines, pageWidth / 2, 35, { align: 'center' });
            
            // Subtitle
            pdf.setFontSize(12);
            pdf.setTextColor(100);
            pdf.setFont('helvetica', 'italic');
            pdf.text(`Created specially for ${activity.childName}`, pageWidth / 2, 50, { align: 'center' });
            
            // Content
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(14);
            pdf.setTextColor(60);
            const contentLines = pdf.splitTextToSize(activity.content, contentWidth);
            pdf.text(contentLines, pageWidth / 2, 62, { align: 'center' });
            
            // Image
            const imageY = 80;
            
            if (activity.imageBase64) {
                const imgData = `data:image/png;base64,${activity.imageBase64}`;
                const imgWidth = contentWidth;
                const imgHeight = 140;
                
                pdf.setDrawColor(0);
                pdf.setLineWidth(1);
                pdf.rect(margin, imageY, imgWidth, imgHeight);
                
                pdf.addImage(imgData, 'PNG', margin + 5, imageY + 5, imgWidth - 10, imgHeight - 10);
            } else {
                pdf.setDrawColor(0);
                pdf.setLineWidth(1);
                pdf.rect(margin, imageY, contentWidth, 140);
                
                pdf.setFontSize(16);
                pdf.setTextColor(200);
                pdf.text('Draw here', pageWidth / 2, imageY + 75, { align: 'center' });
            }
            
            const filename = `${activity.childName}-${activity.topic}.pdf`
                .toLowerCase()
                .replace(/[^a-z0-9-]/g, '-')
                .replace(/-+/g, '-');

            pdf.save(filename);
        } catch (error) {
            console.error('PDF generation error:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setDownloadingId(null);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const getActivityEmoji = (type: string) => {
        switch (type) {
            case 'colouring': return '🎨';
            case 'drawing': return '✏️';
            case 'maze': return '🧩';
            case 'word-search': return '🔤';
            default: return '📄';
        }
    };

    const getActivityColor = (type: string) => {
        switch (type) {
            case 'colouring': return 'bg-purple-500/10 text-purple-400';
            case 'drawing': return 'bg-blue-500/10 text-blue-400';
            case 'maze': return 'bg-green-500/10 text-green-400';
            case 'word-search': return 'bg-orange-500/10 text-orange-400';
            default: return 'bg-gray-500/10 text-gray-400';
        }
    };

    return (
        <div className="min-h-screen bg-[#0f1117] text-white font-sans">
            {/* Navbar */}
            <nav className="border-b border-gray-800 bg-[#0f1117]/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
                        <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        <span className="font-bold text-lg tracking-tight text-white">SmartPrints UK</span>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* DEV Reset Button */}
                        {process.env.NODE_ENV === 'development' && (
                            <button
                                onClick={handleResetUsage}
                                disabled={resettingUsage}
                                className="text-xs font-medium text-yellow-400 hover:text-yellow-300 transition px-3 py-1.5 rounded-md hover:bg-white/5 disabled:opacity-50"
                            >
                                {resettingUsage ? '⏳ Resetting...' : '🔧 DEV: Reset Usage'}
                            </button>
                        )}
                        <button
                            onClick={handleSignOut}
                            className="text-sm font-medium text-gray-400 hover:text-white transition px-3 py-2 rounded-md hover:bg-white/5"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 animate-fade-in">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                        <p className="text-gray-400">Welcome back!</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-4 py-2 rounded-full text-sm font-bold shadow-lg shadow-indigo-500/10">
                            {userPlan.planDisplay} Plan
                        </span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-[#13161c] border border-gray-800 p-6 rounded-2xl shadow-xl">
                        <div className="text-gray-400 text-sm mb-1 uppercase tracking-wider font-bold">Usage</div>
                        <div className="text-4xl font-bold">{userPlan.usage}/{userPlan.limit}</div>
                        <div className="text-xs text-gray-500 mt-2">
                            {userPlan.colouringCount} colouring • {userPlan.drawingCount} drawing
                        </div>
                    </div>
                    <div className="bg-[#13161c] border border-gray-800 p-6 rounded-2xl shadow-xl">
                        <div className="text-gray-400 text-sm mb-1 uppercase tracking-wider font-bold">Total Created</div>
                        <div className="text-4xl font-bold text-indigo-400">{activities.length}</div>
                        <div className="text-xs text-gray-500 mt-2">activities generated</div>
                    </div>
                    <div
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-2xl flex items-center justify-between cursor-pointer hover:shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.02] transition transform shadow-xl"
                        onClick={() => router.push('/generate')}
                    >
                        <div>
                            <div className="text-white/80 text-sm mb-1 font-medium">Create New</div>
                            <div className="text-2xl font-bold">Generate PDF</div>
                        </div>
                        <div className="bg-white/20 p-2 rounded-lg">
                            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        </div>
                    </div>
                </div>

                {/* Recent Activities List */}
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Activity History
                </h2>
                <div className="bg-[#13161c] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
                    {loadingActivities ? (
                        <div className="p-8 text-center text-gray-400">
                            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            Loading your activities...
                        </div>
                    ) : activities.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">
                            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <p className="font-medium mb-2">No activities yet</p>
                            <p className="text-sm text-gray-500">Create your first activity to see it here!</p>
                            <button
                                onClick={() => router.push('/generate')}
                                className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-medium transition"
                            >
                                Create Activity
                            </button>
                        </div>
                    ) : (
                        activities.map((activity) => (
                            <div key={activity.id} className="p-4 border-b border-gray-800/50 flex items-center justify-between hover:bg-white/5 transition group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-inner ${getActivityColor(activity.activityType)}`}>
                                        {getActivityEmoji(activity.activityType)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg group-hover:text-indigo-400 transition">{activity.title}</div>
                                        <div className="text-xs text-gray-500 font-medium">
                                            {formatDate(activity.createdAt)} • {activity.activityType.charAt(0).toUpperCase() + activity.activityType.slice(1)} • For {activity.childName}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => downloadPDF(activity)}
                                    disabled={downloadingId === activity.id}
                                    className="text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 flex items-center gap-2"
                                >
                                    {downloadingId === activity.id ? (
                                        <>
                                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Download PDF
                                        </>
                                    )}
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
