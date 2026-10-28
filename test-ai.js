import fs from 'fs';
import path from 'path';

// Read .env manually
const envPath = path.resolve('.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [k, ...v] = line.trim().split('=');
  if (k && v.length) env[k.trim()] = v.join('=').trim();
});

const PROJECT_ID = env.VITE_FIREBASE_PROJECT_ID || 'gen-lang-client-0433493981';
const API_KEY = env.VITE_GEMINI_API_KEY;

console.log('Project ID:', PROJECT_ID);
console.log('API Key present:', Boolean(API_KEY));

const imagePath = 'C:/Users/RAUL/.gemini/antigravity/brain/1f45af87-bde9-4c10-b047-83d047999883/.user_uploaded/media_1793219006192_86c4ab61.jpg';
const imageBuffer = fs.readFileSync(imagePath);
const base64Data = imageBuffer.toString('base64');
console.log(`Image loaded: ${(imageBuffer.length / 1024).toFixed(1)} KB`);

const models = [
  'gemini-3.5-flash-lite',
  'gemini-3.5-flash',
  'gemini-3.8-flash',
  'gemini-2.5-flash'
];

async function runTest() {
  const prompt = `Analiza esta foto de un cuaderno de atenciones dentales y gastos.
Extrae en JSON:
{
  "atenciones_count": 0,
  "gastos_count": 0,
  "primeras_3_atenciones": [
    { "fecha": "", "boleta": "", "doctora": "", "paciente": "", "tratamiento": "", "monto": 0 }
  ],
  "primeros_3_gastos": [
    { "fecha": "", "monto": 0, "observaciones": "" }
  ]
}`;

  for (const model of models) {
    console.log(`\nProbando modelo: ${model}...`);
    const url = `https://aiplatform.googleapis.com/v1beta1/projects/${PROJECT_ID}/locations/global/publishers/google/models/${model}:generateContent?key=${encodeURIComponent(API_KEY)}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType: 'image/jpeg',
                    data: base64Data
                  }
                }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.1,
            maxOutputTokens: 2048
          }
        })
      });

      const data = await response.json();
      if (!response.ok) {
        console.error(`Error ${response.status}:`, data.error?.message || data);
        continue;
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      console.log('✅ ÉXITO con modelo:', model);
      console.log('Respuesta extraída por la IA:');
      console.log(text);
      return;
    } catch (err) {
      console.error(`Fallo con ${model}:`, err.message);
    }
  }

  // Si falló Vertex, probar generativelanguage estándar
  console.log('\nProbando endpoint generativelanguage...');
  for (const model of ['gemini-2.0-flash', 'gemini-1.5-flash']) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(API_KEY)}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                { text: prompt },
                { inlineData: { mimeType: 'image/jpeg', data: base64Data } }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.1
          }
        })
      });
      const data = await response.json();
      if (response.ok) {
        console.log('✅ ÉXITO con generativelanguage:', model);
        console.log(data.candidates?.[0]?.content?.parts?.[0]?.text);
        return;
      } else {
        console.error('Error genlang:', data.error?.message);
      }
    } catch (e) {
      console.error('Error:', e.message);
    }
  }
}

runTest();

