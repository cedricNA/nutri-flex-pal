export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatResponse {
  message: string;
  error?: string;
}

class ChatService {
  private apiKey: string | null = null;
  private baseUrl = 'https://openrouter.ai/api/v1/chat/completions';

  setApiKey(key: string): void {
    this.apiKey = key;
    localStorage.setItem('openrouter-api-key', key);
  }

  getApiKey(): string | null {
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem('openrouter-api-key');
    }
    return this.apiKey;
  }

  async sendMessage(message: string, conversationHistory: ChatMessage[] = []): Promise<ChatResponse> {
    const apiKey = this.getApiKey();
    
    if (!apiKey) {
      return { message: '', error: 'Clé API OpenRouter non configurée' };
    }

    try {
      const messages = [
        {
          role: 'system',
          content: `Tu es un assistant nutritionnel expert spécialisé dans la nutrition, les régimes alimentaires et la santé. 

INSTRUCTIONS DE FORMATAGE IMPORTANTES :
- Structure tes réponses avec des titres clairs (utilise **Titre** pour les mettre en gras)
- Utilise des listes à puces (- point) ou numérotées (1. point) pour organiser l'information
- Mets en évidence les points importants avec **gras** ou *italique*
- Sépare les différentes sections avec des sauts de ligne
- Utilise des emojis appropriés pour rendre la lecture plus agréable (🥗 🍎 💪 etc.)
- Pour les conseils nutritionnels, présente-les sous forme de liste claire
- Si tu donnes des valeurs nutritionnelles, utilise un format structuré

STYLE DE RÉPONSE :
- Réponds en français de manière claire, précise et bienveillante
- Adapte ton niveau de langage à un utilisateur lambda
- Donne des conseils pratiques et applicables
- Cite des exemples concrets d'aliments ou de recettes quand c'est pertinent
- Termine par un conseil ou encouragement positif

Assure-toi que tes réponses soient faciles à lire et à comprendre, avec une mise en forme optimale pour l'expérience utilisateur.`
        },
        ...conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        {
          role: 'user',
          content: message
        }
      ];

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'NutriFlex'
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1-0528:free',
          messages,
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const data = await response.json();
      return { message: data.choices[0].message.content };
    } catch (error) {
      console.error('Erreur lors de l\'appel à l\'API:', error);
      return { 
        message: '', 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      };
    }
  }

  saveConversation(messages: ChatMessage[]): void {
    localStorage.setItem('chat-history', JSON.stringify(messages));
  }

  loadConversation(): ChatMessage[] {
    try {
      const saved = localStorage.getItem('chat-history');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
    }
    return [];
  }

  clearConversation(): void {
    localStorage.removeItem('chat-history');
  }
}

export const chatService = new ChatService();
