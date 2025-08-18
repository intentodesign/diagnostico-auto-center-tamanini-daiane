# 🚀 Guia de Deploy - Diagnóstico Compact

## Opção 1: GitHub Pages (Recomendado)

### Passo 1: Criar Repositório no GitHub
1. Acesse [github.com](https://github.com) e faça login
2. Clique em "New repository"
3. Nome sugerido: `diagnostico-compact`
4. Marque como "Public"
5. Clique em "Create repository"

### Passo 2: Upload dos Arquivos
1. Clique em "uploading an existing file"
2. Arraste todos os arquivos da pasta `diagnostico-compact`
3. Commit message: "Initial commit - Compact brand diagnosis"
4. Clique em "Commit changes"

### Passo 3: Ativar GitHub Pages
1. Vá para Settings do repositório
2. Scroll até "Pages" no menu lateral
3. Em "Source", selecione "Deploy from a branch"
4. Branch: `main`
5. Folder: `/ (root)`
6. Clique em "Save"

### Passo 4: Acessar a Página
- URL será: `https://[seu-usuario].github.io/diagnostico-compact`
- Pode levar alguns minutos para ficar disponível

---

## Opção 2: Netlify (Backup)

### Método A: Drag & Drop
1. Acesse [netlify.com](https://netlify.com)
2. Faça login/cadastro
3. Arraste a pasta `diagnostico-compact` para a área de deploy
4. Site será publicado automaticamente

### Método B: Git Integration
1. Primeiro, suba os arquivos para GitHub (passos acima)
2. No Netlify, clique em "New site from Git"
3. Conecte com GitHub
4. Selecione o repositório `diagnostico-compact`
5. Deploy automático será configurado

---

## ⚙️ Configurações Pós-Deploy

### 1. Analytics (Obrigatório)
**Google Analytics 4:**
1. Acesse [analytics.google.com](https://analytics.google.com)
2. Crie uma propriedade para "Compact Diagnosis"
3. Copie o Measurement ID (formato: G-XXXXXXXXXX)
4. Substitua `GA_MEASUREMENT_ID` nos arquivos:
   - `index.html` (linha ~30)
   - `js/analytics.js` (linha ~15)

### 2. Assets da Compact (Necessário)
Solicitar ao cliente e substituir:

**Logo da Compact:**
- Formato: SVG ou PNG alta resolução
- Substituir: `assets/compact-logo.svg`
- Tamanho ideal: 200x60px

**Foto da Fachada:**
- Formato: JPG alta resolução
- Substituir: `assets/compact-fachada.jpg`
- Tamanho ideal: 1200x800px
- Otimizar para web antes do upload

**Prints do Instagram:**
- @compactmaquinas
- Últimas 10 postagens
- Stories em destaque
- Para análise e possível inclusão na página

### 3. Customizações Opcionais

**Domínio Personalizado (GitHub Pages):**
1. Compre um domínio (ex: `diagnostico-compact.com.br`)
2. Configure DNS para apontar para GitHub Pages
3. Adicione arquivo `CNAME` na raiz com o domínio

**Domínio Personalizado (Netlify):**
1. Em "Domain settings" no Netlify
2. Clique em "Add custom domain"
3. Configure DNS conforme instruções

**Facebook Pixel (se necessário):**
1. Crie pixel no Facebook Business
2. Substitua `FB_PIXEL_ID` em `js/analytics.js`
3. Ative tracking em `ANALYTICS_CONFIG.facebook.enabled = true`

---

## 🔍 Verificação de Deploy

### Checklist Pós-Deploy:
- [ ] Página carrega corretamente
- [ ] Design responsivo funciona em mobile
- [ ] Animações funcionam suavemente
- [ ] Links WhatsApp e email funcionam
- [ ] Google Analytics está trackando
- [ ] Scroll suave funciona
- [ ] Formulários validam corretamente
- [ ] Performance está boa (usar PageSpeed Insights)

### Testes de Conversão:
- [ ] Clique no WhatsApp gera tracking
- [ ] Clique no email gera tracking
- [ ] Scroll de 75% é registrado
- [ ] Tempo de 5+ minutos é registrado
- [ ] Formulários geram eventos

### Performance Targets:
- [ ] PageSpeed Score > 90
- [ ] First Contentful Paint < 1.8s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1

---

## 📞 Suporte Técnico

### Problemas Comuns:

**Página não carrega:**
- Verificar se todos os arquivos foram enviados
- Checar console do browser para erros
- Aguardar 5-10 minutos para propagação

**Analytics não funciona:**
- Confirmar se GA_MEASUREMENT_ID foi substituído
- Verificar se há bloqueadores de anúncios
- Testar em aba anônima

**Imagens não aparecem:**
- Verificar se arquivos estão na pasta assets/
- Confirmar nomes dos arquivos
- Testar paths no browser

### Contato para Suporte:
- Email: [suporte@intento.com.br]
- WhatsApp: [número da Intento]
- Documentação: Este arquivo + README.md

---

## 📈 Monitoramento Contínuo

### Métricas Principais:
1. **Conversões:** WhatsApp, Email, Formulários
2. **Engajamento:** Tempo na página, scroll depth
3. **Performance:** Core Web Vitals
4. **Tráfego:** Origens, dispositivos, localizações

### Ferramentas Recomendadas:
- Google Analytics 4 (incluído)
- Google Search Console
- PageSpeed Insights
- GTmetrix
- Hotjar (opcional para heatmaps)

### Relatórios Mensais:
- Número de visitantes únicos
- Taxa de conversão
- Origem do tráfego
- Performance técnica
- Sugestões de otimização

---

**Deploy realizado com sucesso! 🎉**

*A página está pronta para converter visitantes em leads qualificados para a Compact.*