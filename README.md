# DevAura - Seu Copiloto de Acessibilidade com IA ♿️

### Consertando a web na origem. A DevAura ajuda desenvolvedores a construir sites acessíveis, não apenas encontrando erros, mas também os explicando.

![DevAura Demo GIF](https://link-para-seu-gif-ou-video.com/demo.gif)
_**(Sugestão: Grave um GIF curto da extensão em ação e substitua o link acima)**_

---

## 🌟 A Grande Visão: O Ecossistema Aura

A inacessibilidade na web é um problema de duas pontas: afeta tanto quem cria quanto quem consome conteúdo. Por isso, criamos o **Ecossistema Aura**, uma solução de 360 graus para este desafio.

* **DevAura (Este Projeto):** A ferramenta para os **criadores**. Nosso copiloto de IA que se integra ao fluxo de trabalho do desenvolvedor para construir sites nativamente acessíveis, consertando o problema na origem.
* **Aura Vision (Nosso Conceito Irmão):** A ferramenta para os **usuários**. Uma suíte de acessibilidade que usa IA para quebrar as barreiras existentes em tempo real na web de hoje.

O **DevAura** constrói um futuro acessível. O **Aura Vision** torna o presente navegável. Juntos, eles formam a nossa solução completa para uma web verdadeiramente para todos.

## ✨ Funcionalidades Principais

* **🤖 Geração de Alt Text com IA:** Passe o mouse sobre qualquer imagem e a DevAura usa o poder do Google Gemini para gerar sugestões de `alt text` ricas e contextuais em tempo real.
* **💡 Busca Semântica "Entenda o Porquê":** Para cada erro encontrado, a DevAura não apenas sugere a correção, mas também oferece um botão "Entenda o Porquê 💡". Usando Gemini Embeddings, a extensão busca em uma base de conhecimento de acessibilidade e fornece um resumo claro e um link para a documentação oficial, transformando a correção de bugs em uma oportunidade de aprendizado.

## 🛠️ Stack de Tecnologias

* **JavaScript (ES6+)**
* **APIs de Extensão do Chrome (Manifest V3)**
* **Google Gemini API:**
    * `gemini-2.5-flash` para geração de conteúdo.
    * `text-embedding-004` para a busca semântica.
* **Node.js:** Para o script de pré-processamento que gera a base de conhecimento.

## 🚀 Instalação e Configuração

Para testar o DevAura, siga estes passos:

#### **Passo 1: Preparar a Base de Conhecimento**
Este passo só precisa ser feito uma vez para gerar o arquivo de inteligência da extensão.

1.  Clone este repositório.
2.  Crie uma pasta separada fora do projeto (ex: `Gerador-Embeddings`).
3.  Dentro dela, execute `npm init -y` e `npm install node-fetch`.
4.  Adicione `"type": "module"` ao arquivo `package.json` gerado.
5.  Copie o script `create_embeddings.js` (disponível no projeto) para esta pasta.
6.  **Importante:** Insira sua chave da API do Google AI Studio no script.
7.  Execute `node create_embeddings.js` no terminal.
8.  Mova o arquivo `knowledge_base.json` gerado para a pasta raiz da extensão.

#### **Passo 2: Configurar a Extensão**

1.  **Obtenha uma Chave de API:** Crie sua chave de API gratuita no [Google AI Studio](https://aistudio.google.com/app/apikey).

2.  **Insira a Chave de API:** Abra o arquivo `background.js` e cole sua chave na seguinte constante:
    ```javascript
    const GEMINI_API_KEY = 'SUA_CHAVE_DE_API_VAI_AQUI';
    ```
    **Atenção:** Não suba sua chave de API para repositórios públicos.

#### **Passo 3: Instalar no Chrome**

1.  Abra o Google Chrome e vá para `chrome://extensions`.
2.  Ative o **"Modo de desenvolvedor"** no canto superior direito.
3.  Clique em **"Carregar sem compactação"**.
4.  Selecione a pasta da extensão DevAura.
5.  A extensão estará instalada e pronta para uso!

## 🗺️ Roadmap Futuro

O DevAura é uma plataforma com enorme potencial. Nossos próximos passos incluem:

* **Analisador de Contraste de Cores:** Identificar e sugerir correções para textos com baixo contraste.
* **Validador de Funções ARIA:** Sugerir o uso correto de `roles` e `aria-labels` para componentes complexos.
* **Aura for CI/CD:** Criar uma ação do GitHub que audita a acessibilidade de um site a cada pull request.

## 👨‍💻 Autores

* **[Seu Nome Aqui]** - Líder do Projeto & Desenvolvedor

## 📄 Licença

Este projeto está licenciado sob a Licença MIT.
