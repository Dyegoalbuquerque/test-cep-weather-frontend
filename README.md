# TestHapvida - Consulta CEP e Clima

Aplicação React para consulta de CEP com integração de previsão do tempo, desenvolvida como prova técnica para a vaga de Desenvolvedor Frontend.

## Tecnologias Utilizadas

- **React 19** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Superset JavaScript com tipagem estática
- **Vite** - Build tool moderna e rápida
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **TanStack Query** - Gerenciamento de estado servidor e cache
- **Vitest** - Framework de testes unitários
- **Testing Library** - Testes de componentes React
- **Date-fns** - Manipulação de datas
- **CSS Modules** - Estilização com CSS puro

## Funcionalidades

### US01 - Consulta de CEP
- Formulário com validação em tempo real
- Máscara automática (XXXXX-XXX)
- Consulta à BrasilAPI com fallback para ViaCEP
- Exibição completa de dados do endereço
- Feedback visual de loading e erros

### US02 - Consulta de Clima
- Dados climáticos baseados no CEP consultado
- Seletor de dias de previsão (1-7 dias)
- Geocodificação automática quando necessário
- Cache de 10 minutos para performance
- Exibição de temperatura, sensação térmica e umidade

### US03 - Interface Responsiva
- Layout adaptável de 320px a 1920px+
- Design mobile-first
- Estados visuais claros (hover, focus, disabled)
- Feedback visual em todas operações

### US04 - Tratamento de Erros
- Mensagens amigáveis para cada tipo de erro
- Loading states em todas operações assíncronas
- Sistema de notificações toast
- Opção de retry em falhas

### US05 - Histórico de Consultas
- Últimas 10 consultas persistidas
- Click para recarregar dados
- Timestamps relativos ("há 2 minutos")
- Opção de limpar histórico

### US06 - Testes Automatizados
- Testes unitários de utilitários e hooks
- Testes de componentes com Testing Library
- Cobertura de casos de sucesso, erro e loading
- Mocking de APIs para consistência

### US07 - Estrutura de Código
- Organização por feature/tipo
- Componentes com responsabilidade única
- Hooks customizados reutilizáveis
- TypeScript com tipagem completa

### US08 - Docker
- Dockerfile multi-stage otimizado
- Build com Node.js e runtime com Nginx
- Configuração nginx para SPA
- Imagem otimizada para produção

### US09 - Documentação
- README completo e estruturado
- Instruções de instalação e execução
- Documentação de decisões técnicas
- Comandos para todas operações

## Estrutura do Projeto

```
TestHapvida/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── CepForm/
│   │   ├── CepResult/
│   │   ├── HistoricoLista/
│   │   ├── LoadingSpinner/
│   │   ├── Toast/
│   │   └── WeatherWidget/
│   ├── config/              # Configurações e constantes
│   ├── hooks/               # Hooks customizados
│   │   ├── useDebounce.ts
│   │   └── useHistorico.ts
│   ├── pages/               # Pages da aplicação
│   │   └── Home/
│   ├── services/            # Serviços de API
│   │   ├── cepService.ts
│   │   └── weatherService.ts
│   ├── styles/              # Estilos globais
│   ├── tests/               # Testes automatizados
│   ├── types/               # Definições TypeScript
│   ├── utils/               # Funções utilitárias
│   ├── App.tsx
│   └── main.tsx
├── Dockerfile
├── nginx.conf
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
└── README.md
```

## Instalação e Execução

### Pré-requisitos

- Node.js 18+ ou 20+
- npm ou yarn

### Instalação

```powershell

git clone https://github.com/Dyegoalbuquerque/test-cep-weather-frontend.git
cd TestHapvida

npm install
```

### Executar em Desenvolvimento

```powershell
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

### Build para Produção

```powershell
npm run build
```

Os arquivos otimizados estarão na pasta `dist/`

### Visualizar Build de Produção

```powershell
npm run preview
```

### Executar Testes

```powershell
# Executar todos os testes
npm test

# Executar com interface UI
npm run test:ui

# Executar com cobertura
npm run test:coverage
```

### Linter

```powershell
npm run lint
```

## Docker

### Build da Imagem

```powershell
docker build -t testhapvida:latest .
```

### Executar Container

```powershell
docker run -d -p 8080:80 --name testhapvida testhapvida:latest
```

A aplicação estará disponível em `http://localhost:8080`

### Parar e Remover Container

```powershell
docker stop testhapvida
docker rm testhapvida
```

## Decisões Técnicas

### Arquitetura

- **Componentes Funcionais**: Uso exclusivo de functional components com hooks
- **Separação de Responsabilidades**: Serviços isolados para APIs, componentes focados em UI
- **Custom Hooks**: Lógica reutilizável encapsulada em hooks customizados
- **CSS Puro**: Escolha por CSS modules para melhor performance e sem dependências extras

### Gerenciamento de Estado

- **TanStack Query**: Escolhido para gerenciar estado de servidor com cache inteligente
- **React Hook Form**: Gerenciamento eficiente de formulários sem re-renders desnecessários
- **Local State**: Estado local com useState para UI simples

### Validação

- **Zod**: Schema validation com TypeScript inference
- **React Hook Form**: Validação em tempo real integrada

### Testes

- **Vitest**: Compatível com Vite, rápido e moderno
- **Testing Library**: Testes focados em comportamento do usuário
- **Cobertura Focada**: Testes nas funcionalidades críticas

### Performance

- **Code Splitting**: Vite com imports dinâmicos
- **Cache de APIs**: 10 minutos para dados climáticos
- **Debounce**: Previne consultas excessivas durante digitação
- **Lazy Loading**: Componentes carregados sob demanda quando necessário

### Acessibilidade

- **Semantic HTML**: Uso correto de tags semânticas
- **ARIA Labels**: Labels descritivos para screen readers
- **Keyboard Navigation**: Navegação completa por teclado
- **Focus Visible**: Estados de foco visíveis

### SEO e Meta Tags

- **Meta Tags**: Configuração básica no index.html
- **Lang Attribute**: Definido como pt-BR

## APIs Utilizadas

### CEP
- **BrasilAPI CEP v2** (Primária): `https://brasilapi.com.br/api/cep/v2/{cep}`
- **ViaCEP** (Fallback): `https://viacep.com.br/ws/{cep}/json/`

### Clima
- **Open-Meteo Forecast**: `https://api.open-meteo.com/v1/forecast`
- **Open-Meteo Geocoding**: `https://geocoding-api.open-meteo.com/v1/search`

## Padrões de Código

- **ESLint**: Configurado com regras recomendadas
- **TypeScript Strict**: Modo strict ativado
- **Naming Conventions**: camelCase para variáveis/funções, PascalCase para componentes
- **File Organization**: Componentes agrupados em pastas com seus estilos

---

