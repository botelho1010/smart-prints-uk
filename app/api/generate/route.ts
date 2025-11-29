import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

// Singleton do Prisma para evitar múltiplas conexões
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export const runtime = 'nodejs';

// Cookie-based tracking for anonymous users (1 free generation)
interface AnonUsage {
    count: number;
}

// Plan limits
const PLAN_LIMITS = {
    free: 3,      // 3 total forever (1 anon + 2 with account)
    basic: 50,    // 50 per month
    plus: 150     // 150 per month
};

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { childName, ageGroup, topic, activityType } = body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: 'API Key missing' }, { status: 500 });
        }

        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
        const isColouring = activityType?.toLowerCase() === 'colouring';
        const isMaze = activityType?.toLowerCase() === 'maze';
        const isWordSearch = activityType?.toLowerCase() === 'word-search';
        const needsImage = isColouring || isMaze; // These types generate images

        // 1. CHECK AUTHENTICATION
        const { userId } = await auth();

        let userRecord: { id: string; clerkId: string; plan: string; freeGenerationsUsed: number } | null = null;
        let isAnonymous = false;
        let anonUsageCount = 0;

        if (userId) {
            // ===== AUTHENTICATED USER FLOW =====
            console.log(`✅ Authenticated user: ${userId}`);

            // 2. BUSCAR OU CRIAR USUÁRIO
            let user = await prisma.user.findUnique({
                where: { clerkId: userId },
            });

            if (!user) {
                // Check if this user already used their anonymous generation
                const cookieStore = await cookies();
                const anonCookie = cookieStore.get('sp_anon_usage');
                const anonUsed = anonCookie ? JSON.parse(anonCookie.value).count : 0;

                user = await prisma.user.create({
                    data: {
                        clerkId: userId,
                        plan: 'free',
                        freeGenerationsUsed: anonUsed // Transfer anonymous usage to account
                    }
                });
                console.log(`📝 New user created with ${anonUsed} generations already used`);
            }

            // 3. CHECK LIMITS BASED ON PLAN
            if (user.plan === 'free') {
                // FREE: 3 total forever
                if (user.freeGenerationsUsed >= PLAN_LIMITS.free) {
                    console.log(`❌ Free limit reached: ${user.freeGenerationsUsed}/${PLAN_LIMITS.free}`);
                    return NextResponse.json({ 
                        error: 'FREE_LIMIT_REACHED',
                        message: 'You have used all your free generations. Upgrade to continue!',
                        used: user.freeGenerationsUsed,
                        limit: PLAN_LIMITS.free
                    }, { status: 403 });
                }
            } else {
                // PAID PLANS: Monthly limit
                let monthlyUsage = await prisma.monthlyUsage.findUnique({
                    where: {
                        userId_month: {
                            userId: user.id,
                            month: currentMonth
                        }
                    }
                });

                if (!monthlyUsage) {
                    monthlyUsage = await prisma.monthlyUsage.create({
                        data: {
                            userId: user.id,
                            month: currentMonth,
                            generationCount: 0
                        }
                    });
                }

                const limit = user.plan === 'basic' ? PLAN_LIMITS.basic : PLAN_LIMITS.plus;
                
                if (monthlyUsage.generationCount >= limit) {
                    console.log(`❌ Monthly limit reached for ${user.plan}: ${monthlyUsage.generationCount}/${limit}`);
                    return NextResponse.json({ 
                        error: 'MONTHLY_LIMIT_REACHED',
                        message: `You have reached your monthly limit of ${limit} generations.`,
                        used: monthlyUsage.generationCount,
                        limit: limit,
                        plan: user.plan
                    }, { status: 403 });
                }
            }

            console.log(`✅ Usage check passed for ${userId} (${user.plan})`);
            userRecord = user;

        } else {
            // ===== ANONYMOUS USER FLOW (1 free generation only) =====
            console.log(`🔓 Anonymous user - checking cookie-based limit`);
            isAnonymous = true;

            const cookieStore = await cookies();
            const anonCookie = cookieStore.get('sp_anon_usage');

            let anonUsage: AnonUsage = { count: 0 };

            if (anonCookie) {
                try {
                    anonUsage = JSON.parse(anonCookie.value);
                } catch (e) {
                    console.error('Error parsing anon usage cookie:', e);
                    anonUsage = { count: 0 };
                }
            }

            anonUsageCount = anonUsage.count;

            // Anonymous users get only 1 free generation
            if (anonUsage.count >= 1) {
                console.log(`❌ Anonymous limit reached - must create account`);
                return NextResponse.json({ 
                    error: 'ANON_LIMIT_REACHED',
                    message: 'Create a free account to get 2 more free generations!',
                    requiresAuth: true
                }, { status: 403 });
            }

            console.log(`✅ Anonymous usage check passed: ${anonUsage.count}/1`);
        }

        // 5. GERAÇÃO DE TEXTO COM GEMINI 2.0 FLASH
        const genAI = new GoogleGenerativeAI(apiKey);
        const textModel = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash',
            generationConfig: {
                responseMimeType: "application/json"
            }
        });

        // Define age-appropriate language and tips based on age group
        const ageGroupConfig: Record<string, { ageName: string; language: string; tips: string; complexity: string }> = {
            'eyfs': {
                ageName: 'Early Years (3-5 years old)',
                language: 'Use very simple, short words. Speak like you are talking to a toddler. Use playful, fun language with lots of excitement! Add cute sounds like "Wow!", "Yay!", "Look!".',
                tips: 'Include a simple tip for parents like: "Help your little one hold the crayon" or "Point to the shapes together".',
                complexity: 'Keep sentences very short (3-5 words each). Use basic vocabulary only.'
            },
            'ks1': {
                ageName: 'Key Stage 1 (5-7 years old)',
                language: 'Use simple, clear language suitable for early readers. Be encouraging and fun. Use short sentences.',
                tips: 'Include a learning tip like: "Can you count how many...?" or "What colours will you use?".',
                complexity: 'Use simple sentences. Can include basic educational elements.'
            },
            'ks2_lower': {
                ageName: 'Lower Key Stage 2 (7-9 years old)',
                language: 'Use clear, engaging language. Can include some interesting facts. Be encouraging but not babyish.',
                tips: 'Include an educational tip or fun fact related to the topic. Challenge them slightly: "Did you know...?" or "Try adding details like...".',
                complexity: 'Can use more complex vocabulary and longer sentences. Include learning opportunities.'
            },
            'ks2_upper': {
                ageName: 'Upper Key Stage 2 (9-11 years old)',
                language: 'Use mature, engaging language. Include interesting facts or challenges. Treat them as capable young learners.',
                tips: 'Include a challenging tip or interesting fact. Encourage creativity and critical thinking: "Think about..." or "Research shows that...".',
                complexity: 'Use rich vocabulary. Can include educational content and creative challenges.'
            }
        };

        const config = ageGroupConfig[ageGroup] || ageGroupConfig['ks1'];

        let systemPrompt = '';

        if (activityType === 'drawing') {
            systemPrompt = `You are creating a drawing activity for a child named ${childName}.

TARGET AGE: ${config.ageName}
LANGUAGE STYLE: ${config.language}
COMPLEXITY: ${config.complexity}

TOPIC: ${topic}

Create a fun, encouraging drawing activity. You MUST adapt your language to match the age group exactly.

${config.tips}

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "title": "A creative, age-appropriate title for the drawing activity",
  "content": "2-3 sentences encouraging the child to draw, written in the appropriate language style for their age. Include a helpful tip or fun fact. Keep it under 50 words total."
}

IMPORTANT: The language MUST match the age group. For EYFS, use toddler-friendly language. For KS2 Upper, use more mature language.`;
        } else if (activityType === 'maze') {
            systemPrompt = `You are creating a maze activity for a child named ${childName}.

TARGET AGE: ${config.ageName}
LANGUAGE STYLE: ${config.language}
COMPLEXITY: ${config.complexity}

TOPIC: ${topic}

Create a fun, encouraging maze activity themed around the topic. You MUST adapt your language to match the age group exactly.

${config.tips}

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "title": "A creative, age-appropriate title for the maze activity (e.g., 'Help the Astronaut Find the Rocket!')",
  "content": "2-3 sentences encouraging the child to solve the maze, written in the appropriate language style for their age. Include a fun story element about why they need to complete the maze. Keep it under 50 words total."
}

IMPORTANT: The language MUST match the age group. For EYFS, use toddler-friendly language. For KS2 Upper, use more mature language.`;
        } else if (activityType === 'word-search') {
            systemPrompt = `You are creating a word search puzzle for a child named ${childName}.

TARGET AGE: ${config.ageName}
LANGUAGE STYLE: ${config.language}
COMPLEXITY: ${config.complexity}

TOPIC: ${topic}

Create a word search puzzle with words related to the topic. You MUST adapt the difficulty to match the age group.

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "title": "A creative, age-appropriate title for the word search (e.g., 'Space Explorer Word Hunt!')",
  "content": "A brief encouraging message for the child.",
  "words": ["WORD1", "WORD2", "WORD3", "WORD4", "WORD5", "WORD6"],
  "grid": [
    ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
    ["K", "L", "M", "N", "O", "P", "Q", "R", "S", "T"],
    ...10 rows total
  ]
}

WORD LIST REQUIREMENTS based on age:
- EYFS (3-5): 4 words, 3-4 letters each, very simple words
- KS1 (5-7): 5 words, 3-5 letters each, simple words
- Lower KS2 (7-9): 6 words, 4-6 letters each
- Upper KS2 (9-11): 8 words, 5-8 letters each

GRID REQUIREMENTS:
- ${ageGroup === 'eyfs' ? '8x8 grid' : ageGroup === 'ks1' ? '10x10 grid' : '12x12 grid'}
- Words can be placed horizontally (left-to-right) or vertically (top-to-bottom)
- Fill remaining spaces with random uppercase letters
- All words MUST be findable in the grid
- Words should NOT overlap

IMPORTANT: Make sure all words in the "words" array are actually present in the grid!`;
        } else {
            systemPrompt = `You are creating a colouring activity for a child named ${childName}.

TARGET AGE: ${config.ageName}
LANGUAGE STYLE: ${config.language}
COMPLEXITY: ${config.complexity}

TOPIC: ${topic}

Create a fun, encouraging colouring activity. You MUST adapt your language to match the age group exactly.

${config.tips}

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "title": "A creative, age-appropriate title for the colouring activity",
  "content": "2-3 sentences encouraging the child to colour, written in the appropriate language style for their age. Include a helpful tip or fun fact. Keep it under 50 words total."
}

IMPORTANT: The language MUST match the age group. For EYFS, use toddler-friendly language. For KS2 Upper, use more mature language.`;
        }

        console.log('Generating text with Gemini 2.0 Flash...');
        console.log('Age group:', ageGroup, '| Config:', config.ageName);

        let parsedTextData;
        try {
            const textResult = await textModel.generateContent(systemPrompt);
            const rawText = textResult.response.text();
            
            console.log('Raw Gemini response:', rawText);

            // Remove markdown code blocks if present
            let cleanedText = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            
            // Try to extract JSON if there's extra text
            const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                cleanedText = jsonMatch[0];
            }

            parsedTextData = JSON.parse(cleanedText);
            console.log('✅ Text generated successfully:', parsedTextData);
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            console.error('Failed to parse response');
            
            // Better fallback with age-appropriate content
            const fallbackContent: Record<string, { title: string; content: string }> = {
                'eyfs': {
                    title: `Yay! ${topic} Fun for ${childName}!`,
                    content: `Wow ${childName}! Look at this! Can you colour it? Use your favourite colours! 🎨`
                },
                'ks1': {
                    title: `${topic} Adventure for ${childName}`,
                    content: `Hi ${childName}! This is your special ${topic} activity. What colours will you choose? Have fun!`
                },
                'ks2_lower': {
                    title: `${childName}'s ${topic} Challenge`,
                    content: `Hey ${childName}! Here's your ${topic} activity. Try using different shading techniques to make it look amazing!`
                },
                'ks2_upper': {
                    title: `${topic} Creative Project for ${childName}`,
                    content: `${childName}, this is your ${topic} activity. Challenge yourself to add details and create depth with your colouring choices.`
                }
            };
            
            parsedTextData = fallbackContent[ageGroup] || fallbackContent['ks1'];
        }

        // 6. GERAÇÃO DE IMAGEM (PARA COLOURING E MAZE)
        let imageBase64 = "";

        if (needsImage) {
            console.log(`Generating image for ${activityType} with Gemini...`);
            try {
                // Define image complexity based on age group
                const imageComplexityConfig: Record<string, { style: string; details: string }> = {
                    'eyfs': {
                        style: 'Very simple, minimal details, large shapes, cartoon style',
                        details: 'Only 1-2 large main elements, very thick outlines, no background details, no small parts, suitable for toddlers aged 3-5'
                    },
                    'ks1': {
                        style: 'Simple but clear, medium-sized shapes, friendly cartoon style',
                        details: '2-3 main elements, thick outlines, minimal background, some simple details, suitable for children aged 5-7'
                    },
                    'ks2_lower': {
                        style: 'Moderately detailed, balanced composition, engaging scene',
                        details: 'Multiple elements, medium outlines, simple background scene, interesting details to colour, suitable for children aged 7-9'
                    },
                    'ks2_upper': {
                        style: 'Detailed and intricate, rich scene with multiple elements',
                        details: 'Complex scene with many elements, finer outlines, detailed background, patterns and textures to colour, challenging but rewarding, suitable for children aged 9-11'
                    }
                };

                const imgConfig = imageComplexityConfig[ageGroup] || imageComplexityConfig['ks1'];

                let imagePrompt = '';

                if (isMaze) {
                    // Maze-specific prompt
                    const mazeComplexity: Record<string, string> = {
                        'eyfs': 'Very simple maze with only 2-3 turns, wide paths, very easy to solve',
                        'ks1': 'Simple maze with 4-5 turns, clear paths, easy to solve',
                        'ks2_lower': 'Medium complexity maze with 6-8 turns, some dead ends',
                        'ks2_upper': 'Complex maze with 10+ turns, multiple dead ends, challenging'
                    };

                    imagePrompt = `Create a black-and-white printable maze for children themed around ${topic}.

AGE GROUP: ${config.ageName}
MAZE COMPLEXITY: ${mazeComplexity[ageGroup] || mazeComplexity['ks1']}

Requirements:
- Clean black lines on white background
- Clear START and END points (marked with simple icons related to ${topic})
- The maze path should be clearly visible
- ${imgConfig.details}
- No shading, no grayscale
- Make it fun and themed around ${topic}

Generate a printable maze activity.`;
                } else {
                    // Colouring page prompt
                    imagePrompt = `Create a black-and-white line art colouring page for children about ${topic}.

AGE GROUP: ${config.ageName}
STYLE: ${imgConfig.style}
COMPLEXITY: ${imgConfig.details}

Requirements:
- Clean black outlines on white background
- No shading, no grayscale, no filled areas
- No text or letters in the image
- The complexity MUST match the age group exactly

Generate a colouring page that is appropriate for the specified age group.`;
                }

                const imageResponse = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{ text: imagePrompt }]
                            }],
                            generationConfig: {
                                responseModalities: ['IMAGE']
                            }
                        })
                    }
                );

                if (!imageResponse.ok) {
                    const errorText = await imageResponse.text();
                    console.error('Image API error:', errorText);
                    throw new Error(`API returned ${imageResponse.status}`);
                }

                const imageData = await imageResponse.json();
                console.log('Image API response received');

                // Extract image from response
                const parts = imageData?.candidates?.[0]?.content?.parts;
                if (parts) {
                    for (const part of parts) {
                        if (part.inlineData?.data) {
                            imageBase64 = part.inlineData.data;
                            console.log(`✅ ${activityType} image generated successfully for age group:`, ageGroup);
                            break;
                        }
                    }
                }

                if (!imageBase64) {
                    console.log('⚠️ No image data in response, parts:', JSON.stringify(parts?.map((p: { text?: string; inlineData?: unknown }) => p.text ? 'text' : p.inlineData ? 'image' : 'unknown')));
                }
            } catch (imgError: unknown) {
                const message = imgError instanceof Error ? imgError.message : 'Unknown error';
                console.error('Image generation error:', message);
            }
        }

        // 7. INCREMENT USAGE COUNTERS & SAVE ACTIVITY

        if (userRecord) {
            // Authenticated user - update database
            if (userRecord.plan === 'free') {
                // Increment total free generations (never resets)
                await prisma.user.update({
                    where: { id: userRecord.id },
                    data: { freeGenerationsUsed: { increment: 1 } }
                });
                console.log(`✅ Free usage incremented for user ${userId}: ${userRecord.freeGenerationsUsed + 1}/${PLAN_LIMITS.free}`);
            } else {
                // Increment monthly usage for paid users
                await prisma.monthlyUsage.upsert({
                    where: {
                        userId_month: {
                            userId: userRecord.id,
                            month: currentMonth
                        }
                    },
                    update: { generationCount: { increment: 1 } },
                    create: {
                        userId: userRecord.id,
                        month: currentMonth,
                        generationCount: 1
                    }
                });
                console.log(`✅ Monthly usage incremented for user ${userId} (${userRecord.plan})`);
            }

            // Save activity to history (including image for PDF re-download)
            await prisma.activity.create({
                data: {
                    userId: userRecord.id,
                    childName,
                    ageGroup,
                    topic,
                    activityType,
                    title: parsedTextData.title,
                    content: parsedTextData.content,
                    imageBase64: imageBase64 || null, // Store image for history downloads
                }
            });
            console.log(`✅ Activity saved to history with image`);

            return NextResponse.json({
                textData: parsedTextData,
                imageBase64,
                activityType
            });

        } else {
            // Anonymous user - update cookie (never expires for tracking)
            const cookieStore = await cookies();
            const anonCookie = cookieStore.get('sp_anon_usage');

            let anonUsage: AnonUsage = { count: 0 };

            if (anonCookie) {
                try {
                    anonUsage = JSON.parse(anonCookie.value);
                } catch {
                    anonUsage = { count: 0 };
                }
            }

            anonUsage.count += 1;

            const response = NextResponse.json({
                textData: parsedTextData,
                imageBase64,
                activityType,
                remainingFree: 1 - anonUsage.count,
                message: anonUsage.count >= 1 ? 'Create a free account to get 2 more generations!' : null
            });

            // Set cookie (expires in 1 year to track anonymous usage)
            response.cookies.set('sp_anon_usage', JSON.stringify(anonUsage), {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 365, // 1 year
            });

            console.log(`✅ Anonymous usage: ${anonUsage.count}/1`);

            return response;
        }

    } catch (error: unknown) {
        console.error('❌ Generate route error:', error);
        const message = error instanceof Error ? error.message : 'Internal server error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}