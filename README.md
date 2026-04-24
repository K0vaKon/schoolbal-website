# Schoolbal Website

Um site de compartilhamento de fotos para Schoolbal em TypeScript com Next.js, Tailwind CSS e suporte para HEIC.

## 🚀 Funcionalidades

### 1. **Autenticação e Papéis**
- Sistema de autenticação simples com dois papéis: `Admin` e `User`
- Usuários normais fazem login através do email `leerling@schoolbal.nl`
- Admins fazem login com `admin@schoolbal.nl`
- Armazenamento de sessão em localStorage

### 2. **Página Principal (Hoofdpagina)**
- Galeria de fotos aprovadas em layout Pinterest (Masonry)
- Botão "Hartje" (Like) sob cada foto
- Admins podem deletar fotos rapidamente
- Contagem de likes em tempo real

### 3. **Página de Upload (Uploaden)**
- Suporte para todos os formatos: JPG, PNG, GIF, WebP, **HEIC/HEIF (iPhone)**
- Conversão automática de HEIC para JPEG no cliente (usando `heic2any`)
- Prévia de imagem antes do envio
- Campo de entrada para nome do remetente
- Compressão automática para otimização

### 4. **Painel de Administração (Beheer)**
- Lista de todas as novas carregamentos
- Funções: "Goedkeuren" (Aprovar) e "Afwijzen" (Rejeitar)
- Seção "Afgewezen" (Rejeitado) com opção de restaurar
- Informações sobre quem carregou a foto
- Possibilidade de adicionar motivo para rejeição

## 📋 Stack Tecnológico

- **Framework**: Next.js 16.2.4 com App Router
- **Linguagem**: TypeScript
- **Styling**: Tailwind CSS
- **Ícones**: Lucide React
- **Layout**: react-masonry-css (Pinterest-style grid)
- **Conversão HEIC**: heic2any
- **Armazenamento**: localStorage (API mock)

## 🛠️ Instalação e Execução

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar servidor de produção
npm start
```

## 🌐 Acesso

O projeto será executado em `http://10.25.2.131:3000`

### Contas de Teste:

**Admin:**
- E-mail: `admin@schoolbal.nl`
- Qualquer nome

**User:**
- E-mail: `leerling@schoolbal.nl` (ou qualquer outro)
- Qualquer nome

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── layout.tsx              # Layout raiz com AuthProvider
│   ├── layout-client.tsx       # Layout do cliente com header e nav
│   ├── page.tsx                # Página inicial (galeria)
│   ├── upload/
│   │   └── page.tsx            # Página de upload
│   ├── admin/
│   │   └── page.tsx            # Painel de administração
│   └── globals.css             # Estilos globais
├── components/
│   ├── LoginComponent.tsx      # Componente de autenticação
│   ├── Navigation.tsx          # Barra de navegação
│   ├── Gallery.tsx             # Galeria com Masonry
│   ├── PhotoCard.tsx           # Card individual de foto
│   ├── UploadComponent.tsx     # Componente de upload
│   └── AdminPanel.tsx          # Painel de administração
├── contexts/
│   └── AuthContext.tsx         # Contexto de autenticação
├── lib/
│   ├── storage.ts              # Utilitários de localStorage
│   └── imageUtils.ts           # Utilitários de processamento de imagens
└── types/
    └── index.ts                # Tipos TypeScript
```

## 🔑 Dados Persistidos em localStorage

- `schoolbal_current_user`: Usuário autenticado
- `schoolbal_photos`: Array de todas as fotos
- `schoolbal_users`: Array de usuários (reservado para expansão futura)

## 💡 Próximos Passos - Backend

Este é um Frontend funcional. Para conectar a um backend real com banco de dados:

1. **Node.js + Prisma Backend**
   - Criar API RESTful com Express
   - Implementar banco de dados com Prisma
   - Adicionar autenticação JWT
   - Implementar upload de arquivos com multer
   - Adicionar validação de dados

2. **Banco de Dados**
   - PostgreSQL ou MongoDB para armazenar fotos
   - Sistema de roles de usuário robusto
   - Rastreamento de aprovações e rejeições

3. **Autenticação**
   - JWT para sessões seguras
   - Refresh tokens
   - Proteção CSRF

## 📝 Notas Sobre HEIC

- Navegadores modernos não suportam nativamente visualização de arquivos HEIC
- A biblioteca `heic2any` converte automaticamente para JPEG no cliente
- A conversão mantém qualidade (90%) e ocorre antes do upload
- Funciona perfeitamente com iPhones e outros dispositivos que usam HEIC

## 🎨 Personalização

- Cores e temas podem ser ajustados em `tailwind.config.ts`
- Idioma está configurado para Holandês (NL)
- Ícones podem ser trocados via biblioteca Lucide React

## ✨ Principais Recursos

- ✅ Autenticação baseada em localStorage
- ✅ Galeria Masonry responsiva
- ✅ Suporte completo a HEIC/HEIF com conversão no cliente
- ✅ Sistema de moderação com aprovação/rejeição
- ✅ Likes e contagem de interações
- ✅ Interface em Holandês
- ✅ TypeScript em 100%
- ✅ Sem dependência de backend (localhost apenas)

