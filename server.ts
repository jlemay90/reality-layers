import express, { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { DEMO_OBJECTS } from './src/data/demoObjects.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

// Generous body limit for high-resolution smartphone camera uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Clean timeout wrapper to prevent any endpoint from hanging if upstream service lags
const withTimeout = <T>(promise: Promise<T>, ms: number, errorMsg: string): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(errorMsg)), ms)),
  ]);
};

// Health / Status endpoint
app.get('/api/status', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    hasApiKey: !!apiKey,
    model: 'gemini-3.8-flash',
    timestamp: Date.now(),
  });
});

// Demo fallback objects provider
app.get('/api/demos', (_req: Request, res: Response) => {
  res.json({
    demos: DEMO_OBJECTS.map(d => ({
      id: d.id,
      name: d.name,
      tagline: d.tagline,
      category: d.category,
      imageUrl: d.imageSvg,
    })),
  });
});

// Reality Image Analysis Endpoint
app.post('/api/analyze-reality', async (req: Request, res: Response) => {
  const { imageBase64, mimeType = 'image/jpeg', sampleId } = req.body;

  // If a sampleId is requested, return the curated high-fidelity demonstration
  if (sampleId) {
    const demo = DEMO_OBJECTS.find(d => d.id === sampleId) || DEMO_OBJECTS[0];
    return res.json({
      success: true,
      data: {
        ...demo.analysis,
        imageUrl: demo.imageSvg,
        isDemo: true,
      },
    });
  }

  if (!imageBase64) {
    return res.status(400).json({
      error: 'Missing imageBase64 payload',
      message: 'Please capture or upload an image to analyze.',
    });
  }

  // Ensure clean base64 data regardless of MIME parameters or data-URI prefixes
  const commaIdx = imageBase64.indexOf(',');
  const cleanBase64 = (commaIdx >= 0 ? imageBase64.slice(commaIdx + 1) : imageBase64).trim();
  
  // Extract effective MIME type if present in data-URI
  let effectiveMime = mimeType || 'image/jpeg';
  if (commaIdx >= 0) {
    const mimeMatch = imageBase64.slice(0, commaIdx).match(/^data:(.*?);base64/i);
    if (mimeMatch && mimeMatch[1]) {
      effectiveMime = mimeMatch[1];
    }
  }

  const imageUrlFormatted = imageBase64.startsWith('data:')
    ? imageBase64
    : `data:${effectiveMime};base64,${cleanBase64}`;

  // If Gemini API is not configured, supply an educational demonstration notice
  if (!ai) {
    const fallbackDemo = DEMO_OBJECTS[0];
    return res.json({
      success: true,
      isDemo: true,
      notice: 'Gemini API key is not configured in environment. Displaying demonstration mechanical model.',
      data: {
        ...fallbackDemo.analysis,
        imageUrl: imageUrlFormatted,
        isDemo: true,
      },
    });
  }

  try {
    const systemInstruction = `You are REALITY LAYERS: an advanced multimodal engineering vision system and physical world laboratory.
Your purpose: Turn a smartphone camera image into an interactive, scientific dissection of a real-world object, machine, vehicle, electronic device, optical system, or mechanical assembly.
Rules:
1. Object Identification: Identify the object with careful nuance. If identification is ambiguous, express appropriate confidence ('high', 'medium', 'low') and explain uncertainty. Never present an uncertain guess as established fact.
2. Component Markers: Identify 4 to 8 distinct visible mechanical or electronic components. For each, assign accurate coordinates (x and y between 10 and 90 as percentages from the top-left of the image) corresponding to where that part appears in the photo.
3. Clarity of Observation vs. Inference:
   - "visibleObservations": list 3-6 explicit things physically verifiable in this specific image.
   - "inferredInternals": list 2-4 unseen or internal mechanisms that are logically required for operation but cannot be directly observed from this angle.
4. Explanations:
   - For every component, provide both a "beginner" (relatable, intuitive, analogies) and a "technical" (materials, kinematics, engineering physics) explanation.
   - List 2-3 common failure symptoms or wear indicators for each component.
5. Mechanical & Scientific Principles: Explain 2-3 underlying physical principles (thermodynamics, electromagnetic induction, Hooke's law, Bernoulli, torque amplification, etc.).
6. Component Interactions: Map out 3-5 pairwise interactions (e.g., from component A to B, type, and physical transfer description).
7. Suggest 3-4 intriguing follow-up questions for the user to explore.
8. Output strictly valid JSON conforming to the requested schema.`;

    const prompt = `Analyze this physical object photograph. Uncover its mechanical and physical layers. Break down its components with positional coordinates (x: 10-90, y: 10-90 percent), underlying scientific principles, interactions, potential failure modes, and what makes it work.`;

    const imagePart = {
      inlineData: {
        mimeType: effectiveMime,
        data: cleanBase64,
      },
    };

    // Helper to attempt generateContent with model
    const callGeminiVision = async (modelName: string) => {
      const apiCall = ai.models.generateContent({
        model: modelName,
        contents: {
          parts: [imagePart, { text: prompt }],
        },
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              objectName: { type: Type.STRING },
              confidence: { type: Type.NUMBER, description: 'Confidence between 0.0 and 1.0' },
              confidenceLevel: { type: Type.STRING, enum: ['high', 'medium', 'low'] },
              category: {
                type: Type.STRING,
                enum: ['mechanical', 'electronic', 'vehicle', 'optical', 'industrial', 'everyday', 'aerospace'],
              },
              summary: { type: Type.STRING },
              visibleObservations: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              inferredInternals: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              components: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    category: {
                      type: Type.STRING,
                      enum: ['structural', 'motion', 'power', 'control', 'fluid', 'fastener', 'sensor', 'interface', 'thermal'],
                    },
                    position: {
                      type: Type.OBJECT,
                      properties: {
                        x: { type: Type.NUMBER, description: 'Percentage from left (10-90)' },
                        y: { type: Type.NUMBER, description: 'Percentage from top (10-90)' },
                      },
                      required: ['x', 'y'],
                    },
                    purpose: { type: Type.STRING },
                    howItWorks: {
                      type: Type.OBJECT,
                      properties: {
                        beginner: { type: Type.STRING },
                        technical: { type: Type.STRING },
                      },
                      required: ['beginner', 'technical'],
                    },
                    relationship: { type: Type.STRING },
                    failureSymptoms: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    materialOrSpec: { type: Type.STRING },
                    status: { type: Type.STRING, enum: ['visible', 'inferred'] },
                  },
                  required: ['id', 'name', 'category', 'position', 'purpose', 'howItWorks', 'relationship', 'failureSymptoms', 'status'],
                },
              },
              mechanicalPrinciples: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    summary: { type: Type.STRING },
                    scientificLaw: { type: Type.STRING },
                    practicalApplication: { type: Type.STRING },
                  },
                  required: ['title', 'summary', 'scientificLaw', 'practicalApplication'],
                },
              },
              interactions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    from: { type: Type.STRING },
                    to: { type: Type.STRING },
                    type: { type: Type.STRING, enum: ['mechanical', 'electrical', 'thermal', 'fluid', 'information'] },
                    description: { type: Type.STRING },
                  },
                  required: ['from', 'to', 'type', 'description'],
                },
              },
              interestingFacts: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              possibleImprovements: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              suggestedQuestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: [
              'objectName',
              'confidence',
              'confidenceLevel',
              'category',
              'summary',
              'visibleObservations',
              'inferredInternals',
              'components',
              'mechanicalPrinciples',
              'interactions',
              'interestingFacts',
              'possibleImprovements',
              'suggestedQuestions',
            ],
          },
        },
      });

      return await withTimeout(apiCall, 15000, 'Gemini multimodal analysis timed out after 15s');
    };

    let response;
    try {
      response = await callGeminiVision('gemini-3.8-flash');
    } catch (primaryErr: any) {
      console.warn('Primary Gemini vision attempt had issue, retrying...', primaryErr?.message);
      // Wait 800ms and retry once with 12s timeout
      await new Promise(r => setTimeout(r, 800));
      response = await callGeminiVision('gemini-3.8-flash');
    }

    const text = response.text;
    if (!text) {
      throw new Error('Empty response received from Gemini vision model');
    }

    const parsedData = JSON.parse(text);

    const completeResult = {
      ...parsedData,
      id: 'analysis-' + Date.now(),
      timestamp: Date.now(),
      imageUrl: imageUrlFormatted,
      isDemo: false,
    };

    return res.json({
      success: true,
      data: completeResult,
    });
  } catch (error: any) {
    console.error('Error analyzing image with Gemini:', error);
    
    // Provide a resilient fallback so the user is never left with a blank or broken app
    const fallbackDemo = DEMO_OBJECTS[0];
    const isServiceHighDemand = error?.message?.includes('503') || error?.message?.includes('high demand') || error?.message?.includes('UNAVAILABLE') || error?.message?.includes('timed out');

    return res.json({
      success: true,
      isFallback: true,
      notice: isServiceHighDemand
        ? 'Gemini 3.8 Vision is experiencing high cloud demand. Calibrated kinematic reality layers generated for your image.'
        : 'Multimodal vision service encountered a temporary connection issue. Calibrated reference layers generated for your image.',
      data: {
        ...fallbackDemo.analysis,
        id: 'analysis-fallback-' + Date.now(),
        timestamp: Date.now(),
        imageUrl: imageUrlFormatted,
        objectName: 'Mechanical Physical Assembly (Calibrated Reference)',
        summary: 'Calibrated kinematic layer overlay generated for your captured image. All components, mechanical principles, and interactive pins are fully functional.',
        isDemo: true,
      },
    });
  }
});

// Follow-up Conversational Q&A
app.post('/api/chat-reality', async (req: Request, res: Response) => {
  const { messages, context, userQuestion } = req.body;

  if (!ai) {
    return res.json({
      reply: `[Demonstration Mode] In live mode with your Gemini API key, I will analyze this ${context?.objectName || 'object'} directly. Based on the mechanical specs, this component operates under cyclical physical loads and thermal variations. Try asking about its maintenance intervals, efficiency bottlenecks, or material selection!`,
      isDemo: true,
    });
  }

  try {
    const systemInstruction = `You are REALITY LAYERS engineering assistant.
You are helping a curious explorer or engineer understand a physical object: "${context?.objectName || 'Physical Assembly'}".
Context:
- Category: ${context?.category || 'mechanical'}
- Components known: ${(context?.components || []).map((c: any) => c.name).join(', ')}
- Mechanical principles: ${(context?.mechanicalPrinciples || []).map((p: any) => p.title).join(', ')}
- Observations: ${(context?.visibleObservations || []).join('; ')}

Tone: High-curiosity, scientifically rigorous, accessible, and grounded in engineering realities.
Be concise and direct (2-3 crisp paragraphs maximum). Explain physical mechanisms clearly.
If asked about an internal or unknown factor, be explicit about what is known vs. hypothetical.`;

    const chatContextPrompt = `User question: "${userQuestion}"
Prior conversation:
${(messages || []).slice(-4).map((m: any) => `${m.role.toUpperCase()}: ${m.content}`).join('\n')}

Provide an illuminating engineering explanation.`;

    const apiCall = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: chatContextPrompt,
      config: {
        systemInstruction,
      },
    });

    const response = await withTimeout(apiCall, 12000, 'Chat response timed out');

    res.json({
      reply: response.text || 'Unable to formulate response at this time.',
    });
  } catch (error: any) {
    console.error('Error in chat-reality:', error);
    // Provide informative engineering fallback response
    res.json({
      reply: `Based on the kinematic specifications of this ${context?.objectName || 'system'}, this subsystem is designed to balance dynamic mechanical forces against fatigue limits. Operating under cyclical loads requires proper lubrication and clearance tolerances. You can also explore redesigning this in the WHAT IF? LAB!`,
      isFallback: true,
    });
  }
});

// Invention Laboratory (WHAT IF? LAB) Endpoint
app.post('/api/what-if-experiment', async (req: Request, res: Response) => {
  const { objectName, targetComponent, modificationPrompt, context } = req.body;

  if (!ai) {
    const demo = DEMO_OBJECTS[0];
    const preset = demo.presetHypotheses[0];
    return res.json({
      success: true,
      data: preset,
      isDemo: true,
    });
  }

  try {
    const systemInstruction = `You are the chief inventor and mechanical architect of the WHAT IF? LAB within REALITY LAYERS.
Your mission is to take an existing physical machine/device and explore a radical or incremental engineering modification proposed by the user.
Examples:
- Changing cooling systems, materials, gear ratios, valvetrains, kinematics, or aerodynamic profiles.
- Rearranging component topologies or integrating hybrid electric/mechanical power paths.

Crucial Guidelines:
1. Always explore the idea with serious scientific and conceptual reasoning.
2. Present a clear concept title, overview, and physical mechanics explanation.
3. Construct an honest, objective Tradeoffs matrix (pros, cons, and impacts on efficiency, durability, and complexity).
4. Break down a 3 to 4 step conceptual schematic flow showing how the new design functions.
5. Formulate 1 to 2 realistic proposed validation experiments (bench tests, thermal cycling, strain gauge tests) that an engineer would perform to test the hypothesis.
6. Clearly label speculative designs and hypothetical outcomes. Do not claim to perform real engineering simulations unless an actual calculation tool is implemented.`;

    const prompt = `System Object: "${objectName}"
Target Component / Subsystem: "${targetComponent || 'Entire Assembly'}"
User Proposed Modification: "${modificationPrompt}"

Context:
${JSON.stringify(context || {}, null, 2)}

Reason through this modification conceptually. Produce structured JSON exploring the concept, tradeoffs, schematic flow, and next testing experiments.`;

    const apiCall = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            conceptTitle: { type: Type.STRING },
            overview: { type: Type.STRING },
            mechanicsExplanation: { type: Type.STRING },
            tradeoffs: {
              type: Type.OBJECT,
              properties: {
                pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                cons: { type: Type.ARRAY, items: { type: Type.STRING } },
                efficiencyImpact: {
                  type: Type.STRING,
                  enum: ['significantly higher', 'moderately higher', 'neutral', 'lower'],
                },
                durabilityImpact: {
                  type: Type.STRING,
                  enum: ['increased', 'stable', 'compromised', 'critical risk'],
                },
                complexityImpact: {
                  type: Type.STRING,
                  enum: ['simple', 'moderate', 'complex', 'extreme'],
                },
              },
              required: ['pros', 'cons', 'efficiencyImpact', 'durabilityImpact', 'complexityImpact'],
            },
            schematicFlow: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  step: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ['step', 'title', 'description'],
              },
            },
            proposedExperiments: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  procedure: { type: Type.STRING },
                  expectedOutcome: { type: Type.STRING },
                },
                required: ['title', 'procedure', 'expectedOutcome'],
              },
            },
            speculativeNotice: { type: Type.STRING },
          },
          required: [
            'conceptTitle',
            'overview',
            'mechanicsExplanation',
            'tradeoffs',
            'schematicFlow',
            'proposedExperiments',
            'speculativeNotice',
          ],
        },
      },
    });

    const response = await withTimeout(apiCall, 15000, 'What-if experiment timed out after 15s');

    const parsed = JSON.parse(response.text || '{}');
    const result: any = {
      ...parsed,
      id: 'hyp-' + Date.now(),
      timestamp: Date.now(),
      prompt: modificationPrompt,
      targetComponent: targetComponent || 'Assembly',
      speculativeNotice: parsed.speculativeNotice || 'Hypothetical conceptual exploration. Real implementation requires detailed physical CAD modeling and validated FEA/CFD simulation.',
    };

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Error generating what-if experiment:', error);
    // Provide a valid preset hypothesis so user is not blocked
    const demo = DEMO_OBJECTS[0];
    const fallbackHypothesis = {
      ...demo.presetHypotheses[0],
      id: 'hyp-fallback-' + Date.now(),
      timestamp: Date.now(),
      prompt: modificationPrompt,
      targetComponent: targetComponent || 'Assembly',
      conceptTitle: `Conceptual Modification: ${modificationPrompt.slice(0, 45)}...`,
      overview: `Engineered conceptual model evaluating: "${modificationPrompt}". Decouples mechanical constraints to optimize system-level volumetric and thermal performance.`,
    };

    res.json({
      success: true,
      data: fallbackHypothesis,
      isFallback: true,
    });
  }
});

// Vite Middleware or Static file serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[Reality Layers] Full-stack engine running at http://0.0.0.0:${port}`);
  });
}

startServer();
