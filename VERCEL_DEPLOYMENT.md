# 📦 GUIA DE DEPLOY - VERCEL

## Status: ✅ Pronto para Deploy

Seu projeto foi enviado com sucesso para o GitHub e está pronto para ser deployado na Vercel.

---

## 🚀 PASSOS PARA DEPLOY

### 1️⃣ Preparação no Vercel

1. Acesse: https://vercel.com
2. Clique em **"Add New"** → **"Project"**
3. Clique em **"Import Git Repository"**
4. Conecte sua conta GitHub (se solicitado)
5. Selecione o repositório: **`DevKelvinbd/JusPauta-Pesquisa`**

### 2️⃣ Configuração do Projeto

- **Framework Preset**: Será detectado automaticamente como **Vite** ✓
- **Root Directory**: `.` (padrão)
- **Build Command**: `npm run build` (padrão do Vite)
- **Output Directory**: `dist` (padrão do Vite)

### 3️⃣ Variáveis de Ambiente

**SUPER IMPORTANTE**: Configure as variáveis antes de fazer deploy!

Clique em **"Environment Variables"** e adicione:

```
VITE_FIREBASE_API_KEY         = [sua chave do Firebase]
VITE_FIREBASE_AUTH_DOMAIN     = [seu domínio Firebase]
VITE_FIREBASE_PROJECT_ID      = [seu ID do projeto]
VITE_FIREBASE_STORAGE_BUCKET  = [seu bucket]
VITE_FIREBASE_MESSAGING_SENDER_ID = [seu sender ID]
VITE_FIREBASE_APP_ID          = [seu app ID]
VITE_ADMIN_PASSWORD           = juspauta2026  (ou sua senha custom)
```

> Copie essas informações do seu arquivo `.env.local` ou do Firebase Console

### 4️⃣ Deploy

Clique em **"Deploy"** e aguarde 2-3 minutos

---

## ✅ Após o Deploy

### Verificar se tudo funcionou:

- [ ] URL do projeto aparece no Vercel dashboard
- [ ] Acesse a URL em `/admin` (deve pedir senha)
- [ ] Teste o login com a senha configurada
- [ ] Verifique se o formulário principal está em `/`
- [ ] Teste enviar uma resposta (deve sincronizar com Firestore)
- [ ] Verifique os gráficos no dashboard
- [ ] Teste a responsividade em mobile

### Endereço típico:
```
https://juspauata-pesquisa.vercel.app
```

---

## 🔄 Atualizações Futuras

A partir de agora, a Vercel fará deploy automático:

- **Cada push em `main`** → Deploy automático para produção
- **Cada Pull Request** → Preview deployment (testar antes de mesclar)
- **Se o build falhar** → Rollback automático para versão anterior

---

## 🛠️ Solução de Problemas

### Build falhando no Vercel?

1. Verifique console do Vercel (aba "Build Logs")
2. Certifique-se de que variáveis de ambiente estão corretas
3. Teste build localmente: `npm run build`

### Gráficos não aparecem?

- Verifique se Recharts foi instalado: `npm ls recharts`
- Verifique console do navegador por erros

### Dados não sincronizando?

- Verifique Firebase rules de segurança
- Verifique se as variáveis Firebase estão corretas
- Teste conexão localmente

### Botão "Exportar Excel" não funciona?

- XLSX já vem instalado ✓
- Verifique console por erros

---

## 📋 Checklist Final

- [x] Projeto no GitHub
- [x] Código commitado com histórico limpo
- [x] Build testado localmente
- [x] .gitignore configurado
- [x] vercel.json pronto
- [ ] **Variáveis de ambiente no Vercel** ← Próximo passo
- [ ] Deploy realizado
- [ ] Testes pós-deploy

---

## 🎯 Resultado Esperado

Dashboard admin totalmente funcional na web com:

✓ 6 KPI Cards com dados em tempo real
✓ 4 Gráficos interativos (Pie, Bar, Line)
✓ Top 5s de dores, ferramentas, funcionalidades
✓ Tabela com filtros e paginação
✓ Exportar para Excel
✓ Responsivo em mobile/tablet/desktop
✓ Ícones profissionais SVG
✓ Dark theme elegante

---

## 📞 Suporte

Se tiver dúvidas no deploy Vercel:
- Docs: https://vercel.com/docs
- Dashboard Help: https://vercel.com/support

---

**Pronto para fazer o deploy? 🚀**

Siga os 4 passos acima e sua aplicação estará no ar em minutos!
