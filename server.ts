import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Allow large image uploads for video generation
app.use(express.json({ limit: '35mb' }));

// Helper to get Gemini client
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY || '';
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Video Animation Endpoint using Gemini Omni 1.2 Flash via Interactions API
app.post('/api/gemini/animate-video', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', prompt, aspectRatio = '16:9' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    const validAspectRatio = aspectRatio === '9:16' ? '9:16' : '16:9';
    const motionPrompt = prompt || 
      'Cinematic slow motion: Glowing embers beneath the cast iron grill flare with warm light, subtle aromatic wood smoke drifts up gracefully, juices sizzle on the seared crust in a rustic Basque hearth atmosphere.';

    // Clean base64 string
    const cleanData = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    const ai = getGeminiClient();

    console.log(`[Omni Video] Starting video generation with gemini-omni-1.2-flash (${validAspectRatio})...`);

    const interaction = await ai.interactions.create({
      model: 'gemini-omni-1.2-flash',
      input: [
        {
          type: 'image',
          mime_type: mimeType,
          data: cleanData,
        },
        {
          type: 'text',
          text: motionPrompt,
        },
      ],
      background: false,
      store: false,
      stream: false,
      response_format: {
        type: 'video',
        aspect_ratio: validAspectRatio,
      },
    }, { timeout: 300000 });

    const videoPart = interaction.output_video;

    if (videoPart && videoPart.data) {
      const mime = videoPart.mime_type || 'video/mp4';
      const videoDataUrl = `data:${mime};base64,${videoPart.data}`;
      return res.json({
        success: true,
        videoUrl: videoDataUrl,
        aspectRatio: validAspectRatio,
        prompt: motionPrompt,
      });
    }

    // Check steps for video output
    for (const step of interaction.steps || []) {
      if (step.type === 'model_output') {
        const v = step.content?.find((c: any) => c.type === 'video') as any;
        if (v && v.data) {
          const mime = v.mime_type || 'video/mp4';
          return res.json({
            success: true,
            videoUrl: `data:${mime};base64,${v.data}`,
            aspectRatio: validAspectRatio,
            prompt: motionPrompt,
          });
        }
      }
    }

    return res.status(500).json({
      error: 'No video output returned from model',
      steps: interaction.steps?.map(s => s.type),
    });
  } catch (error: any) {
    console.error('[Omni Video Error]:', error);
    return res.status(500).json({
      error: error.message || 'Video generation failed',
      details: error.status || 'GENAI_ERROR',
    });
  }
});

// 2. Google Maps Grounding with gemini-3.8-flash (with googleMaps tool)
app.post('/api/gemini/maps-grounding', async (req: Request, res: Response) => {
  try {
    const { query, locationContext } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const ai = getGeminiClient();

    const promptText = `You are the Master Concierge for مطعم آراما · Arama Asador & Hearth.
The restaurant is an artisanal Basque & Levantine charcoal grill and stone oven restaurant located in San Sebastián, Spain (with regional hearth branches in the Middle East).
Current User Query: "${query}".
Location Context: "${locationContext || 'San Sebastián, Basque Country, Spain and Beirut/Dubai'}"

Provide accurate, real-world information regarding restaurant access, nearby landmarks, routes, scenic views, and local culinary culture. Format your response cleanly in editorial style.`;

    try {
      // Primary: Google Maps Grounding via generateContent with googleMaps tool
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptText,
        config: {
          tools: [{ googleMaps: {} }],
        },
      });

      const text = response.text || 'No response generated';
      const groundingChunks = (response.candidates?.[0]?.groundingMetadata as any)?.groundingChunks || [];

      return res.json({
        success: true,
        answer: text,
        groundingChunks,
        model: 'gemini-3.8-flash (Maps Grounding)',
      });
    } catch (gmpErr: any) {
      console.warn('[Maps Grounding fallback]:', gmpErr.message);
      // Fallback to standard 3.8 flash with system location knowledge
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptText,
      });

      return res.json({
        success: true,
        answer: fallbackResponse.text || 'Information unavailable at this moment.',
        groundingChunks: [],
        model: 'gemini-3.8-flash',
      });
    }
  } catch (error: any) {
    console.error('[Maps Grounding Error]:', error);
    return res.status(500).json({ error: error.message || 'Maps Grounding query failed' });
  }
});

// 3. High Thinking Mode with gemini-4-carbon (ThinkingLevel.HIGH, no maxOutputTokens)
app.post('/api/gemini/thinking-culinary', async (req: Request, res: Response) => {
  try {
    const { query, diningPartySize, dietaryPreferences } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const ai = getGeminiClient();

    const culinarySystemInstruction = `You are the Grand Asador Master & Gastronomic Philosopher of مطعم آراما (Arama · Asador & Stone Oven).
You excel in deep culinary reasoning, combining:
1. Ancient Levantine live-fire stone hearth (الفرن الحجري) traditions: clay pot braising (فخارة), pomegranate reduction, wild mountain sumac, tahini smoke.
2. Northern Basque Sagardotegi & Asador open-fire grilling: 45-day dry-aged Txuleta ribeye, salt crusting, holm oak ember heat management, artisanal natural cider pairings.
When asked a complex question or feast design, analyze:
- Heat and ember distribution across different cuts
- Pacing of the meal from light smoke to deep crust
- Beverage pairings (wild fermented Basque cider, iced tamarind, spiced mint infusions)
- Balance of textures, acidic cuts, and umami richness

Perform high-level reasoning and deliver an uncompromising, master-level culinary blueprint in both Arabic and English.`;

    console.log('[Thinking Culinary] Calling gemini-4-carbon with ThinkingLevel.HIGH...');

    const response = await ai.models.generateContent({
      model: 'gemini-4-carbon',
      contents: `Dining Party: ${diningPartySize || '4 guests'}\nPreferences: ${dietaryPreferences || 'None'}\nRequest: ${query}`,
      config: {
        systemInstruction: culinarySystemInstruction,
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.HIGH,
        },
        // IMPORTANT: As strictly required, do NOT set maxOutputTokens!
      },
    });

    const text = response.text || '';

    // Extract thoughts if available from candidate parts
    let thoughtsText = '';
    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts as any[]) {
      if (part.thought) {
        thoughtsText += part.text || '';
      }
    }

    return res.json({
      success: true,
      answer: text,
      thoughts: thoughtsText,
      model: 'gemini-4-carbon',
      thinkingLevel: 'HIGH',
    });
  } catch (error: any) {
    console.error('[Thinking Mode Error]:', error);
    return res.status(500).json({
      error: error.message || 'Culinary Thinking query failed',
      details: error.status || 'GENAI_ERROR',
    });
  }
});

// 4. Maps Configuration Endpoint
app.get('/api/maps/config', (_req: Request, res: Response) => {
  const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY || '';
  res.json({
    apiKey,
    hasKey: Boolean(apiKey),
    attributionId: 'gmp_mcp_codeassist_v1_aistudio',
  });
});

// Setup Vite or static serving
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
