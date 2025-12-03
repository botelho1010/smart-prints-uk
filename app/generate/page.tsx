'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Footer } from '@/components/landing/footer';
import jsPDF from 'jspdf';

export default function Home() {
    const [formData, setFormData] = useState({
        childName: '',
        ageGroup: 'ks1',
        topic: '',
        activityType: 'colouring'
    });
    const [loading, setLoading] = useState(false);
    const [downloadingPdf, setDownloadingPdf] = useState(false);
    const [result, setResult] = useState<{
        textData: { title: string; content: string; words?: string[]; grid?: string[][] };
        imageBase64: string;
        activityType: string;
    } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const downloadPDF = async () => {
        if (!result) return;
        
        setDownloadingPdf(true);
        
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
            pdf.text(new Date().toLocaleDateString('en-GB'), pageWidth - margin, 15, { align: 'right' });
            
            // Title
            pdf.setFontSize(24);
            pdf.setTextColor(49, 46, 129); // indigo-900
            const titleLines = pdf.splitTextToSize(result.textData.title, contentWidth);
            pdf.text(titleLines, pageWidth / 2, 35, { align: 'center' });
            
            // Subtitle
            pdf.setFontSize(12);
            pdf.setTextColor(100);
            pdf.setFont('helvetica', 'italic');
            pdf.text(`Created specially for ${formData.childName}`, pageWidth / 2, 50, { align: 'center' });
            
            // Content
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(14);
            pdf.setTextColor(60);
            const contentLines = pdf.splitTextToSize(result.textData.content, contentWidth);
            pdf.text(contentLines, pageWidth / 2, 62, { align: 'center' });
            
            // Image or Word Search
            const imageY = 80;
            
            if (result.activityType === 'word-search' && result.textData.grid) {
                // Draw word search grid
                const grid = result.textData.grid;
                const cellSize = Math.min(contentWidth / grid[0].length, 8);
                const gridWidth = cellSize * grid[0].length;
                const startX = (pageWidth - gridWidth) / 2;
                
                pdf.setFontSize(10);
                pdf.setTextColor(0);
                
                grid.forEach((row, rowIndex) => {
                    row.forEach((letter, colIndex) => {
                        const x = startX + (colIndex * cellSize);
                        const y = imageY + (rowIndex * cellSize);
                        
                        // Draw cell border
                        pdf.setDrawColor(200);
                        pdf.rect(x, y, cellSize, cellSize);
                        
                        // Draw letter
                        pdf.text(letter, x + cellSize / 2, y + cellSize / 2 + 2, { align: 'center' });
                    });
                });
                
                // Words to find
                if (result.textData.words) {
                    const wordsY = imageY + (grid.length * cellSize) + 15;
                    pdf.setFontSize(12);
                    pdf.setTextColor(100);
                    pdf.text('Find these words:', pageWidth / 2, wordsY, { align: 'center' });
                    
                    pdf.setFontSize(11);
                    pdf.setTextColor(49, 46, 129);
                    const wordsText = result.textData.words.join('   •   ');
                    pdf.text(wordsText, pageWidth / 2, wordsY + 8, { align: 'center' });
                }
            } else if (result.imageBase64) {
                // Add the generated image
                const imgData = `data:image/png;base64,${result.imageBase64}`;
                const imgWidth = contentWidth;
                const imgHeight = 140;
                
                // Draw border around image area
                pdf.setDrawColor(0);
                pdf.setLineWidth(1);
                pdf.rect(margin, imageY, imgWidth, imgHeight);
                
                // Add image inside
                pdf.addImage(imgData, 'PNG', margin + 5, imageY + 5, imgWidth - 10, imgHeight - 10);
            } else {
                // Empty drawing area
                pdf.setDrawColor(0);
                pdf.setLineWidth(1);
                pdf.rect(margin, imageY, contentWidth, 140);
                
                pdf.setFontSize(16);
                pdf.setTextColor(200);
                pdf.text('Draw here', pageWidth / 2, imageY + 75, { align: 'center' });
            }
            
            const filename = `${formData.childName || 'activity'}-${formData.topic || 'smartprints'}.pdf`
                .toLowerCase()
                .replace(/[^a-z0-9-]/g, '-')
                .replace(/-+/g, '-');
            
            pdf.save(filename);
        } catch (error) {
            console.error('PDF generation error:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setDownloadingPdf(false);
        }
    };

    const generateActivity = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            
            if (response.status === 403) {
                // Handle anonymous user limit
                if (data.error === 'ANON_LIMIT_REACHED') {
                    alert("🎨 Love it? Create a FREE account to unlock 2 more activities!\n\nIt only takes 10 seconds.");
                    window.location.href = '/sign-up';
                    return;
                }

                // Handle free account limit
                if (data.error === 'FREE_LIMIT_REACHED') {
                    alert("🎨 You've used all 3 free activities!\n\nUpgrade to Basic for 50 activities/month, or Plus for 150/month.");
                    window.location.href = '/#plans';
                    return;
                }

                // Handle monthly limit
                if (data.error === 'MONTHLY_LIMIT_REACHED') {
                    const planName = data.plan === 'basic' ? 'Basic' : 'Plus';
                    alert(`📊 You've reached your ${planName} monthly limit (${data.limit} activities).\n\n${data.plan === 'basic' ? 'Upgrade to Plus for 150/month!' : 'Your limit resets next month.'}`);
                    return;
                }

                alert("✋ Limit reached! Please upgrade your plan to continue.");
                return;
            }

            if (data.error) throw new Error(data.error);
            setResult(data);
        } catch (error) {
            console.error(error);
            alert('Oops! Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f1117] text-white font-sans selection:bg-indigo-500 selection:text-white">
            {/* Header / Navbar */}
            <nav className="border-b border-gray-800 bg-[#0f1117]/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        {/* Printer Icon SVG */}
                        <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        <span className="font-bold text-lg tracking-tight">SmartPrints UK</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <SignedIn>
                            <Link href="/dashboard" className="text-sm font-medium text-gray-400 hover:text-white transition">
                                Dashboard
                            </Link>
                            <UserButton
                                afterSignOutUrl="/sign-in"
                                appearance={{
                                    elements: {
                                        avatarBox: "w-9 h-9",
                                        userButtonPopoverCard: "bg-[#1a1d26] border border-gray-700",
                                        userButtonPopoverActionButton: "text-gray-300 hover:bg-white/5",
                                        userButtonPopoverActionButtonText: "text-gray-300",
                                        userButtonPopoverFooter: "hidden",
                                    }
                                }}
                            />
                        </SignedIn>
                        <SignedOut>
                            <Link
                                href="/sign-in"
                                className="px-4 py-2 rounded-lg text-sm font-bold bg-indigo-600 hover:bg-indigo-500 transition"
                            >
                                Sign In
                            </Link>
                        </SignedOut>
                    </div>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-6 py-12">

                {/* Hero Section */}
                <div className="text-center mb-12">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
                        {/* Sparkles Icon SVG */}
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 3.214L13 21l-2.286-6.857L5 12l5.714-3.214z" />
                        </svg>
                        AI Powered
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500 mb-4">
                        Create Magic Activities
                    </h1>
                    <p className="text-gray-400 text-lg max-w-xl mx-auto">
                        Tell us about your child and we&apos;ll craft a unique educational printable in seconds.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* Form Section */}
                    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-sm">
                        <form onSubmit={generateActivity} className="space-y-6">

                            {/* Child's Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Child&apos;s Name</label>
                                <input
                                    type="text"
                                    name="childName"
                                    value={formData.childName}
                                    onChange={handleChange}
                                    className="w-full bg-[#1a1d26] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition"
                                    placeholder="e.g. Gabriel"
                                    required
                                />
                            </div>

                            {/* Age Group */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Age Group</label>
                                <div className="relative">
                                    <select
                                        name="ageGroup"
                                        value={formData.ageGroup}
                                        onChange={handleChange}
                                        className="w-full bg-[#1a1d26] border border-gray-700 rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition"
                                    >
                                        <option value="eyfs">EYFS (Ages 3-5)</option>
                                        <option value="ks1">KS1 (Ages 5-7)</option>
                                        <option value="ks2_lower">Lower KS2 (Ages 7-9)</option>
                                        <option value="ks2_upper">Upper KS2 (Ages 9-11)</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        {/* Chevron Down SVG */}
                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>

                            {/* Topic */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Topic or Interest</label>
                                <input
                                    type="text"
                                    name="topic"
                                    value={formData.topic}
                                    onChange={handleChange}
                                    className="w-full bg-[#1a1d26] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition"
                                    placeholder="e.g. Fractions, Space, Dinosaurs"
                                    required
                                />
                            </div>

                            {/* Activity Type Selector */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Activity Type</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, activityType: 'colouring' })}
                                        className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${formData.activityType === 'colouring'
                                                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/20'
                                                : 'bg-[#1a1d26] border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-200'
                                            }`}
                                    >
                                        🎨 Colouring Page
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, activityType: 'drawing' })}
                                        className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${formData.activityType === 'drawing'
                                                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/20'
                                                : 'bg-[#1a1d26] border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-200'
                                            }`}
                                    >
                                        ✏️ Drawing Page
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, activityType: 'maze' })}
                                        className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${formData.activityType === 'maze'
                                                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/20'
                                                : 'bg-[#1a1d26] border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-200'
                                            }`}
                                    >
                                        🧩 Maze
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, activityType: 'word-search' })}
                                        className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${formData.activityType === 'word-search'
                                                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/20'
                                                : 'bg-[#1a1d26] border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-200'
                                            }`}
                                    >
                                        🔤 Word Search
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        {/* Spinner SVG */}
                                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Teaching the AI robots...
                                    </span>
                                ) : (
                                    'Generate Activity PDF'
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Preview Section */}
                    <div className="relative">
                        {/* Background decoration */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur-2xl opacity-20 pointer-events-none"></div>

                        <div className="relative bg-white rounded-2xl shadow-2xl min-h-[600px] flex flex-col transition-all overflow-hidden border border-gray-800">

                            {!result && !loading && (
                                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-12 text-center">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        {/* Printer Icon SVG */}
                                        <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                        </svg>
                                    </div>
                                    <p className="font-medium">Your activity preview will appear here</p>
                                    <p className="text-sm mt-2 text-gray-500">Ready to print instantly</p>
                                </div>
                            )}

                            {loading && (
                                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-12">
                                    <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                                    <p className="text-gray-600 font-medium animate-pulse">Creating masterpiece...</p>
                                </div>
                            )}

                            {result && (
                                <div className="flex-1 flex flex-col animate-fade-in bg-white h-full">
                                    {/* Printable Area */}
                                    <div className="flex-1 p-8 text-gray-900 flex flex-col bg-white">
                                        {/* Paper Header */}
                                        <div className="flex justify-between items-start mb-6 border-b pb-4">
                                            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">SmartPrints UK</h2>
                                            <div className="text-xs text-gray-400">{new Date().toLocaleDateString()}</div>
                                        </div>

                                        {/* Activity Content */}
                                        <div className="text-center space-y-4 mb-6">
                                            <h1 className="text-3xl font-bold text-indigo-900 leading-tight">{result.textData.title}</h1>
                                            <p className="text-gray-500 italic font-medium">Created specially for {formData.childName}</p>
                                            <p className="text-lg text-gray-700 leading-relaxed max-w-md mx-auto">{result.textData.content}</p>
                                        </div>

                                        {/* Canvas Area */}
                                        <div className="flex-1 border-4 border-gray-900 rounded-lg relative bg-gray-50 flex items-center justify-center overflow-hidden min-h-[300px]">
                                            {result.activityType === 'word-search' && result.textData.grid ? (
                                                // Word Search Grid
                                                <div className="p-4 w-full">
                                                    <div className="flex justify-center mb-4">
                                                        <div className="inline-grid gap-1" style={{ 
                                                            gridTemplateColumns: `repeat(${result.textData.grid[0]?.length || 10}, minmax(0, 1fr))` 
                                                        }}>
                                                            {result.textData.grid.map((row, rowIndex) => (
                                                                row.map((letter, colIndex) => (
                                                                    <div 
                                                                        key={`${rowIndex}-${colIndex}`}
                                                                        className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-sm sm:text-base font-bold text-gray-800 border border-gray-300 bg-white"
                                                                    >
                                                                        {letter}
                                                                    </div>
                                                                ))
                                                            ))}
                                                        </div>
                                                    </div>
                                                    {/* Word List */}
                                                    {result.textData.words && (
                                                        <div className="mt-4 text-center">
                                                            <p className="text-sm font-bold text-gray-600 mb-2">Find these words:</p>
                                                            <div className="flex flex-wrap justify-center gap-2">
                                                                {result.textData.words.map((word, index) => (
                                                                    <span 
                                                                        key={index}
                                                                        className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
                                                                    >
                                                                        {word}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : result.imageBase64 ? (
                                                <Image
                                                    src={`data:image/png;base64,${result.imageBase64}`}
                                                    alt="Activity image"
                                                    className="w-full h-full object-contain p-4"
                                                    width={400}
                                                    height={400}
                                                    unoptimized
                                                />
                                            ) : (
                                                <span className="text-gray-400 font-handwriting text-xl opacity-50 absolute bottom-4 right-4">Draw here</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="p-6 border-t border-gray-100 print:hidden">
                                        <div className="flex gap-3 justify-center">
                                            {/* Download PDF Button */}
                                            <button
                                                onClick={downloadPDF}
                                                disabled={downloadingPdf}
                                                className="bg-indigo-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-indigo-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {downloadingPdf ? (
                                                    <>
                                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Generating...
                                                    </>
                                                ) : (
                                                    <>
                                                        {/* Download Icon */}
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        Download PDF
                                                    </>
                                                )}
                                            </button>
                                            
                                            {/* Print Button */}
                                            <button
                                                onClick={() => window.print()}
                                                className="bg-gray-900 text-white px-6 py-2.5 rounded-full font-medium hover:bg-black transition flex items-center gap-2"
                                            >
                                                {/* Printer Icon */}
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                                </svg>
                                                Print
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}