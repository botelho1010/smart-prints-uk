'use client';

import React, { useState } from 'react';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useUserPlan } from '@/hooks/useUserPlan';
import jsPDF from 'jspdf';

export default function Home() {
  const router = useRouter();
  const userPlan = useUserPlan();

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
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [resettingUsage, setResettingUsage] = useState(false);
  
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
        const imgHeight = 140; // Fixed height for the activity area
        
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

      if (response.status === 403) {
        const errorData = await response.json();

        // Handle anonymous user limit (1 free without account)
        if (errorData.error === 'ANON_LIMIT_REACHED') {
          alert("🎨 Love it? Create a FREE account to unlock 2 more activities!\n\nIt only takes 10 seconds.");
          router.push('/sign-up');
          return;
        }

        // Handle free account limit (3 total)
        if (errorData.error === 'FREE_LIMIT_REACHED') {
          alert("🎨 You've used all 3 free activities!\n\nUpgrade to Basic for 50 activities/month, or Plus for 150/month.");
          document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' });
          return;
        }

        // Handle monthly limit for paid users
        if (errorData.error === 'MONTHLY_LIMIT_REACHED') {
          const planName = errorData.plan === 'basic' ? 'Basic' : 'Plus';
          alert(`📊 You've reached your ${planName} monthly limit (${errorData.limit} activities).\n\n${errorData.plan === 'basic' ? 'Upgrade to Plus for 150/month!' : 'Your limit resets next month.'}`);
          if (errorData.plan === 'basic') {
            document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' });
          }
          return;
        }

        // Generic limit error
        alert("✋ Limit reached! Please upgrade your plan to continue.");
        document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      if (!response.ok) throw new Error('Generation error');

      const data = await response.json();
      setResult(data);

      // Refetch plan status to update usage counter
      await userPlan.refetch();

    } catch (error) {
      console.error(error);
      alert('Oops! Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planId: string) => {
    setProcessingPlan(planId);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId })
      });

      // Handle authentication error
      if (response.status === 401) {
        alert("Please sign in to upgrade your plan.");
        router.push('/sign-in');
        setProcessingPlan(null);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Checkout failed');
      }

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: unknown) {
      console.error('Upgrade error:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      alert(`Could not start upgrade: ${message}`);
      setProcessingPlan(null);
    }
  };

  // Feature 4: DEV-only reset usage button
  const handleResetUsage = async () => {
    if (!confirm('DEV: Reset your free plan usage?')) return;

    setResettingUsage(true);
    try {
      const response = await fetch('/api/dev/reset-usage', {
        method: 'POST',
      });

      // Handle authentication error
      if (response.status === 401) {
        alert('Please sign in to reset usage.');
        router.push('/sign-in');
        setResettingUsage(false);
        return;
      }

      const data = await response.json();

      if (response.ok) {
        alert(`✅ Usage reset! Deleted ${data.deletedCount} records.`);
        // Refetch plan status
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

  // Determine if user is on a paid plan
  const isPaidPlan = userPlan.plan === 'basic' || userPlan.plan === 'plus';

  return (
    <div className="min-h-screen bg-[#0f1117] text-white font-sans selection:bg-indigo-500 selection:text-white pb-20">

      {/* NAVBAR with Clerk Components */}
      <nav className="border-b border-gray-800 bg-[#0f1117]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <span className="font-bold text-lg tracking-tight">SmartPrints UK</span>
          </Link>

          <div className="flex items-center gap-6">
            <a href="#plans" className="text-sm font-medium text-gray-400 hover:text-white transition hidden md:block">Plans</a>

            {/* Signed In: Show Dashboard link and user button */}
            <SignedIn>
              <Link href="/dashboard" className="text-sm font-medium text-gray-400 hover:text-white transition">
                Dashboard
              </Link>

              {/* Current Plan Badge */}
              <span className="hidden md:inline-block px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {userPlan.planDisplay} Plan
              </span>

              {/* Upgrade Button (hidden if on paid plan) */}
              {!isPaidPlan && (
                <button
                  onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hidden md:block px-4 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition"
                >
                  Upgrade
                </button>
              )}

              {/* DEV Reset Button */}
              {process.env.NODE_ENV === 'development' && (
                <button
                  onClick={handleResetUsage}
                  disabled={resettingUsage}
                  className="text-xs font-medium text-yellow-400 hover:text-yellow-300 transition px-3 py-1.5 rounded-md hover:bg-white/5 disabled:opacity-50"
                >
                  {resettingUsage ? '⏳' : '🔧 DEV'}
                </button>
              )}

              {/* Clerk User Button */}
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

            {/* Signed Out: Show Sign In button */}
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

      {/* HERO & FORM */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 mb-6">Create Magic Activities</h1>
          <p className="text-gray-400 text-lg">Personalized educational printables in seconds.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-24">
          <div className="bg-[#13161c] border border-gray-800 rounded-2xl p-8 shadow-2xl relative">
            <form onSubmit={generateActivity} className="space-y-6 relative z-10">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">Child&apos;s Name</label>
                <input type="text" name="childName" value={formData.childName} onChange={handleChange} className="w-full bg-[#1a1d26] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-indigo-500 transition outline-none" placeholder="e.g. Gabriel" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">Age Group</label>
                <select name="ageGroup" value={formData.ageGroup} onChange={handleChange} className="w-full bg-[#1a1d26] border border-gray-700 rounded-lg px-4 py-3 text-white outline-none">
                  <option value="eyfs">EYFS (3-5)</option>
                  <option value="ks1">KS1 (5-7)</option>
                  <option value="ks2_lower">Lower KS2 (7-9)</option>
                  <option value="ks2_upper">Upper KS2 (9-11)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">Topic</label>
                <input type="text" name="topic" value={formData.topic} onChange={handleChange} className="w-full bg-[#1a1d26] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-indigo-500 transition outline-none" placeholder="e.g. Space, Dinosaurs" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">Activity Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setFormData({ ...formData, activityType: 'colouring' })} className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${formData.activityType === 'colouring' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-[#1a1d26] border-gray-700 text-gray-400'}`}>🎨 Colouring</button>
                  <button type="button" onClick={() => setFormData({ ...formData, activityType: 'drawing' })} className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${formData.activityType === 'drawing' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-[#1a1d26] border-gray-700 text-gray-400'}`}>✏️ Drawing</button>
                  <button type="button" onClick={() => setFormData({ ...formData, activityType: 'maze' })} className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${formData.activityType === 'maze' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-[#1a1d26] border-gray-700 text-gray-400'}`}>🧩 Maze</button>
                  <button type="button" onClick={() => setFormData({ ...formData, activityType: 'word-search' })} className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${formData.activityType === 'word-search' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-[#1a1d26] border-gray-700 text-gray-400'}`}>🔤 Word Search</button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition disabled:opacity-50 mt-2">
                {loading ? 'Creating Magic...' : 'Generate Activity PDF'}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl h-[600px] flex flex-col border border-gray-800 overflow-hidden">
            {!result ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-12 text-center bg-gray-50">
                <p className="font-medium">Your preview will appear here</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col h-full overflow-y-auto bg-white">
                {/* Printable Area */}
                <div className="flex-1 p-8 text-gray-900 flex flex-col bg-white">
                  <div className="text-center space-y-4 mb-6">
                    <h1 className="text-3xl font-bold text-indigo-900">{result.textData.title}</h1>
                    <p className="text-gray-500 italic">Created specially for {formData.childName}</p>
                    <p className="text-lg text-gray-700">{result.textData.content}</p>
                  </div>
                  <div className="flex-1 border-4 border-gray-900 rounded-lg relative bg-gray-50 flex items-center justify-center min-h-[300px]">
                    {result.activityType === 'word-search' && result.textData.grid ? (
                      <div className="p-4 w-full">
                        <div className="flex justify-center mb-4">
                          <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${result.textData.grid[0]?.length || 10}, minmax(0, 1fr))` }}>
                            {result.textData.grid.map((row, rowIndex) => (
                              row.map((letter, colIndex) => (
                                <div key={`${rowIndex}-${colIndex}`} className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-sm sm:text-base font-bold text-gray-800 border border-gray-300 bg-white">{letter}</div>
                              ))
                            ))}
                          </div>
                        </div>
                        {result.textData.words && (
                          <div className="mt-4 text-center">
                            <p className="text-sm font-bold text-gray-600 mb-2">Find these words:</p>
                            <div className="flex flex-wrap justify-center gap-2">
                              {result.textData.words.map((word, index) => (
                                <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">{word}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : result.imageBase64 ? (
                      <Image src={`data:image/png;base64,${result.imageBase64}`} className="max-w-full max-h-full p-4" alt="Activity" width={400} height={400} unoptimized />
                    ) : (
                      <span className="text-gray-300 font-handwriting text-2xl">Draw Here</span>
                    )}
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="p-4 border-t border-gray-100 print:hidden">
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={downloadPDF}
                      disabled={downloadingPdf}
                      className="bg-indigo-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-indigo-700 transition flex items-center gap-2 disabled:opacity-50"
                    >
                      {downloadingPdf ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          Generating...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                          Download PDF
                        </>
                      )}
                    </button>
                    <button onClick={() => window.print()} className="bg-gray-900 text-white px-6 py-2.5 rounded-full font-medium hover:bg-black transition flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                      Print
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PLANS */}
        <div id="plans" className="border-t border-gray-800 pt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Upgrade Your Plan</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* FREE */}
            <div className={`bg-[#13161c] border rounded-2xl p-6 ${userPlan.plan === 'free' ? 'border-green-500' : 'border-gray-800'}`}>
              <h3 className="text-xl font-bold mb-2">Free</h3>
              <p className="text-3xl font-bold mb-4">£0</p>
              <ul className="text-sm text-gray-400 space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  3 activities total
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  All 4 activity types
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  PDF download
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  No activity history
                </li>
              </ul>
              <button className="w-full py-2 border border-gray-600 rounded-lg cursor-not-allowed opacity-50">
                {userPlan.plan === 'free' ? 'Current Plan' : 'Free'}
              </button>
            </div>
            {/* BASIC */}
            <div className={`bg-[#13161c] border rounded-2xl p-6 relative ${userPlan.plan === 'basic' ? 'border-green-500' : 'border-indigo-500/50'}`}>
              <div className="absolute top-0 right-0 bg-indigo-600 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">POPULAR</div>
              <h3 className="text-xl font-bold mb-2 text-indigo-400">Basic</h3>
              <p className="text-3xl font-bold mb-4">£4.99<span className="text-sm font-normal text-gray-500">/month</span></p>
              <ul className="text-sm text-gray-400 space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <strong className="text-white">50 activities/month</strong>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  All 4 activity types
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  PDF download
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Activity history
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Re-download past PDFs
                </li>
              </ul>
              {userPlan.plan === 'basic' ? (
                <button className="w-full py-2 bg-green-600 rounded-lg font-bold cursor-default">Current Plan</button>
              ) : (
                <button
                  onClick={() => handleUpgrade('basic')}
                  disabled={!!processingPlan}
                  className="w-full py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition font-bold flex justify-center disabled:opacity-50"
                >
                  {processingPlan === 'basic' ? 'Processing...' : 'Upgrade to Basic'}
                </button>
              )}
            </div>
            {/* PLUS */}
            <div className={`bg-[#13161c] border rounded-2xl p-6 ${userPlan.plan === 'plus' ? 'border-green-500' : 'border-gray-800'}`}>
              <h3 className="text-xl font-bold mb-2 text-purple-400">Plus</h3>
              <p className="text-3xl font-bold mb-4">£9.99<span className="text-sm font-normal text-gray-500">/month</span></p>
              <ul className="text-sm text-gray-400 space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <strong className="text-white">150 activities/month</strong>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  All 4 activity types
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  PDF download
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Activity history
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Re-download past PDFs
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <strong className="text-purple-400">Priority support</strong>
                </li>
              </ul>
              {userPlan.plan === 'plus' ? (
                <button className="w-full py-2 bg-green-600 rounded-lg font-bold cursor-default">Current Plan</button>
              ) : (
                <button
                  onClick={() => handleUpgrade('plus')}
                  disabled={!!processingPlan}
                  className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:opacity-90 transition font-bold flex justify-center disabled:opacity-50"
                >
                  {processingPlan === 'plus' ? 'Processing...' : 'Go Plus'}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}