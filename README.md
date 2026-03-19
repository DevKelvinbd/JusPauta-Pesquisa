# JusPauta — Pesquisa de Validação

Formulário de pesquisa para identificar as dores reais de advogados brasileiros.  
**Stack:** Vite + React + Firebase Firestore + Vercel

---

## Estrutura

```
/               → Formulário da pesquisa (público)
/admin          → Painel de respostas (protegido por senha)
```

---

## Setup Rápido (15 minutos)

### 1. Firebase

1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Clique em **"Criar projeto"** → dê um nome (ex: `juspauta-pesquisa`)
3. Vá em **Build > Firestore Database** → **Criar banco de dados**
4. Selecione **"Iniciar no modo de teste"** (para desenvolvimento)
5. Vá em **Configurações ⚙️ > Geral > Seus apps** → clique no ícone **Web (</>)**
6. Registre o app (nome: `pesquisa`) → copie os valores de `firebaseConfig`

### 2. Configurar o Projeto

```bash
# Clone ou copie os arquivos
cd juspauta-pesquisa

# Instale dependências
npm install

# Crie o arquivo .env baseado no exemplo
cp .env.example .env
```

Edite o `.env` com os valores do Firebase:

```
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=juspauta-pesquisa.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=juspauta-pesquisa
VITE_FIREBASE_STORAGE_BUCKET=juspauta-pesquisa.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

VITE_ADMIN_PASSWORD=sua-senha-aqui
```

### 3. Testar Localmente

```bash
npm run dev
```

Acesse `http://localhost:5173` para o formulário e `http://localhost:5173/admin` para o painel.

### 4. Deploy na Vercel

**Opção A — Via CLI:**
```bash
npm install -g vercel
vercel
```

**Opção B — Via GitHub:**
1. Suba o projeto para um repositório GitHub
2. Acesse [vercel.com](https://vercel.com) → **New Project** → importe o repo
3. Em **Environment Variables**, adicione todas as variáveis do `.env`
4. Clique em **Deploy**

> **Importante:** Adicione as variáveis de ambiente na Vercel em  
> Settings → Environment Variables. Sem isso, o Firebase não conecta.

---

## Funcionalidades

### Formulário (`/`)
- 11 perguntas estratégicas em 5 seções
- Tipos: seleção única, múltipla, escala, texto livre, contato
- Salva automaticamente no Firebase Firestore
- Fallback para localStorage se Firebase falhar
- Responsivo (funciona no celular)

### Painel Admin (`/admin`)
- Protegido por senha
- Lista todas as respostas em ordem cronológica
- Cards com estatísticas rápidas (total, perfil mais comum, satisfação média)
- Visualização detalhada de cada resposta
- **Exportação para Excel (.xlsx)** com um clique

---

## Regras do Firestore (Produção)

Quando sair do modo de teste, configure estas regras no Firebase Console:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /respostas/{documento} {
      // Qualquer pessoa pode criar uma resposta
      allow create: if true;
      // Ninguém pode editar ou deletar
      allow update, delete: if false;
      // Leitura só autenticado (ou remova para o admin funcionar sem auth)
      allow read: if true;
    }
  }
}
```

---

## Personalização

- **Perguntas:** Edite `src/data/questions.js`
- **Visual:** Edite `src/index.css` (variáveis CSS) e `src/pages/Survey.jsx` (estilos inline)
- **Senha admin:** Mude `VITE_ADMIN_PASSWORD` no `.env`

---

## Links Úteis

- [Firebase Console](https://console.firebase.google.com)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vite Docs](https://vitejs.dev)
