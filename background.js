// background.js

// --- Configuration ---
// Sua chave de API está inserida aqui.
const GEMINI_API_KEY = 'AIzaSyA0PkU6Uplj0yKcpPGacvqxKmw4q0Nw6KQ'; 

// URLs para as APIs, usando a chave acima.
const CONTENT_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
const EMBEDDING_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${GEMINI_API_KEY}`;
let knowledgeBase = []; // Array para guardar nossa base de conhecimento

// --- Seção de Inicialização e Funções de Busca Semântica ---

// Carrega o arquivo knowledge_base.json quando a extensão inicia
async function loadKnowledgeBase() {
    try {
        const response = await fetch(chrome.runtime.getURL('knowledge_base.json'));
        knowledgeBase = await response.json();
        console.log("DevAura: Base de conhecimento carregada com sucesso.");
    } catch (error) {
        console.error("DevAura: Falha ao carregar a base de conhecimento.", error);
    }
}
loadKnowledgeBase();

// Funções matemáticas para calcular a similaridade entre os textos
function dotProduct(vecA, vecB) {
    let product = 0;
    for (let i = 0; i < vecA.length; i++) { product += vecA[i] * vecB[i]; }
    return product;
}
function magnitude(vec) {
    let sum = 0;
    for (let i = 0; i < vec.length; i++) { sum += vec[i] * vec[i]; }
    return Math.sqrt(sum);
}
function cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB) return 0;
    return dotProduct(vecA, vecB) / (magnitude(vecA) * magnitude(vecB));
}

// --- Fim da Seção ---


// --- Função Principal de Análise ---
// A função foi expandida para também buscar o contexto
async function analyzeImage(imageData) {
    try {
        // Parte 1: Gerar o Alt Text (lógica original que já funcionava)
        const altTextPrompt = `You are a world-class expert in web accessibility (WCAG). Describe this image for a website's alt text. Your description should be concise and informative. Focus on the content and function of the image. Do NOT start your response with "This is an image of" or similar phrases. Do NOT include quotation marks in your response.`;
        
        const parts = [{ text: altTextPrompt }, {
            inline_data: {
                mime_type: "image/jpeg",
                data: imageData.base64Data.split(',')[1]
            }
        }];

        const contentResponse = await fetch(CONTENT_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts }] })
        });

        if (!contentResponse.ok) {
            const errorBody = await contentResponse.json();
            throw new Error(`API Error: ${errorBody.error?.message}`);
        }
        const data = await contentResponse.json();
        const suggestion = data.candidates?.[0]?.content?.parts?.[0]?.text || "AI could not generate a description.";
        
        // Parte 2: Buscar o Contexto Educacional
        let context = null;
        if (knowledgeBase.length > 0) {
            const contextQuery = "importância do alt text em imagens para acessibilidade";
            
            const queryResponse = await fetch(EMBEDDING_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ model: "models/text-embedding-004", content: { parts: [{ text: contextQuery }] } })
            });

            const queryData = await queryResponse.json();
            if (queryData.embedding) {
                const queryEmbedding = queryData.embedding.values;
                let bestMatch = { score: -1, article: null };
                knowledgeBase.forEach(article => {
                    const score = cosineSimilarity(queryEmbedding, article.embedding);
                    if (score > bestMatch.score) {
                        bestMatch = { score, article };
                    }
                });

                if (bestMatch.article) {
                    context = { // Monta o objeto de contexto para a interface
                        url: bestMatch.article.url,
                        summary: bestMatch.article.content
                    };
                }
            }
        }
        
        // Retorna o objeto completo com a sugestão E o contexto
        return { 
            src: imageData.src,
            suggestion: suggestion.trim(),
            context: context
        };

    } catch (error) {
        console.error("DevAura: Error during analysis:", error);
        return {
            src: imageData.src,
            suggestion: `Error: ${error.message}`,
            context: null
        };
    }
}

// --- Message Handling ---
// O listener agora chama a nova função 'analyzeImage'
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'ANALYZE_IMAGES') {
        const analysisPromises = request.payload.map(analyzeImage); // Chama a função atualizada
        Promise.all(analysisPromises)
            .then(results => {
                chrome.runtime.sendMessage({
                    type: 'ANALYSIS_COMPLETE',
                    payload: results
                });
            });
        return true; 
    }
     if (request.type === 'NO_IMAGES_FOUND') {
        chrome.runtime.sendMessage({ type: 'ANALYSIS_COMPLETE', payload: [] });
    }
});

// --- Side Panel Logic ---
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));