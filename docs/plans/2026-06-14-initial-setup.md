# Plano: Initial Setup — Finance MF Remote

Status: done

Autor: Daniel

Data: 2026-06-14

## TL;DR

Criar `finance-mf` como Angular 19 Remote MFE (Native Federation) que expõe:
- `./Component` → Entry component (`entry.component.ts`)
- `./Routes` → Aplicação completa com lazy-loading (`app.routes.ts`)

Este plano é uma receita passo a passo para reproduzir o projeto do zero.

---

## Fase 1 — Scaffold do Projeto

1. Criar projeto Angular 19 standalone com routing e SCSS:
```bash
ng new finance-mf --standalone --routing --style=scss
cd finance-mf
```

2. Instalar dependências:
```bash
npm install --save @angular-architects/native-federation@^19.0.23
npm install --save @softarc/native-federation-node@^3.3.4
npm install --save primeng@^19.1.4 @primeng/themes@^19.1.4 primeicons@^7.0.0
npm install --save @angular/cdk@^19.2.19
npm install --save chart.js@^4.5.1
npm install --save es-module-shims@^1.5.12
```

3. Os arquivos de configuração já existem por padrão:
   - `tsconfig.json` (base)
   - `tsconfig.app.json` (app)
   - `tsconfig.spec.json` (testes)
   - Criar `tsconfig.federation.json` (veja Fase 2)

## Fase 2 — Native Federation (Remote)

4. Criar `federation.config.js` na raiz do projeto:

```javascript
const { shareAll, withModuleFederationPlugin } = require('@angular-architects/native-federation/build');

module.exports = withModuleFederationPlugin({
  name: 'finance-mf',
  
  exposes: {
    './Component': './src/app/entry.component.ts',
    './Routes': './src/app/app.routes.ts'
  },

  shared: shareAll({
    singleton: true,
    strictVersion: true,
    requiredVersion: 'auto'
  }),

  skip: [
    'rxjs',
    'chart.js',
    'primeicons',
    '@primeng/themes'
  ]
});
```

5. Criar `tsconfig.federation.json` na raiz do projeto:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/app"
  },
  "files": ["src/main.ts"],
  "include": ["src/**/*.d.ts"]
}
```

6. Editar `angular.json` — seção `"serve"` para aplicação padrão:

```json
"serve": {
  "builder": "@angular-architects/native-federation:dev-server",
  "options": {
    "browserTarget": "finance-mf:build",
    "port": 4202
  }
}
```

Editar `angular.json` — seção `"build"` para aplicação padrão:

```json
"build": {
  "builder": "@angular-architects/native-federation:build",
  "options": {
    "outputPath": "dist/finance-mf",
    "index": "src/index.html",
    "main": "src/main.ts",
    "polyfills": ["zone.js"],
    "tsConfig": "tsconfig.app.json",
    "inlineStyleLanguage": "scss",
    "assets": ["src/favicon.ico", "src/assets"],
    "styles": ["src/styles.scss"],
    "scripts": []
  },
  "configurations": {
    "production": {
      "budgets": [
        {
          "type": "initial",
          "maximumWarning": "500kb",
          "maximumError": "1mb"
        }
      ],
      "outputHashing": "all"
    }
  }
}
```

7. Editar `src/main.ts` para dinâmico bootstrap (padrão Native Federation):

```typescript
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

const bootstrap = () => import('./bootstrap').then(m => m.bootstrap);

platformBrowserDynamic()
  .bootstrapModule(bootstrap)
  .catch(err => console.error(err));
```

8. Criar `src/bootstrap.ts`:

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { EntryComponent } from './app/entry.component';
import { appConfig } from './app/app.config';

export const bootstrap = () => bootstrapApplication(EntryComponent, appConfig);
```

## Fase 3 — Environments e Config HTTP

9. Criar `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiFinanceUrl: 'http://localhost:8082'
};
```

10. Criar `src/environments/environment.production.ts`:

```typescript
export const environment = {
  production: true,
  apiFinanceUrl: 'https://api.finance.example.com'
};
```

11. Criar `src/app/app.config.ts`:

```typescript
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { Aura } from '@primeng/themes';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.dark-mode'
        }
      }
    })
  ]
};
```

## Fase 4 — Rotas

12. Criar `src/app/app.routes.ts`:

```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/finance/finance.component').then(m => m.FinanceComponent)
  }
];
```

## Fase 5 — Componentes

13. Criar `src/app/entry.component.ts`:

```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'finance-mf-entry',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`
})
export class EntryComponent {}
```

14. Criar `src/app/pages/finance/finance.component.ts`:

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-finance',
  standalone: true,
  imports: [CommonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './finance.component.html'
})
export class FinanceComponent {}
```

15. Criar `src/app/pages/finance/finance.component.html`:

```html
<p-toast key="success"></p-toast>
<p-toast key="error"></p-toast>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow">
      <div class="px-4 py-6 sm:px-6 lg:px-8">
        <div class="flex items-center gap-3">
          <i class="pi pi-wallet text-3xl text-blue-600"></i>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Finanças</h1>
        </div>
      </div>
    </div>

    <!-- Breadcrumb -->
    <div class="px-4 py-4 sm:px-6 lg:px-8">
      <nav class="flex" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-4">
          <li>
            <div>
              <a href="#" class="text-gray-500 dark:text-gray-400 hover:text-gray-700">Home</a>
            </div>
          </li>
          <li>
            <div class="flex items-center">
              <svg class="h-5 w-5 text-gray-400 dark:text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
              </svg>
              <a href="#" class="ml-4 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700">Finanças</a>
            </div>
          </li>
        </ol>
      </nav>
    </div>

    <!-- Content -->
    <div class="px-4 py-6 sm:px-6 lg:px-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <p class="text-gray-600 dark:text-gray-400">Módulo de Finanças — Conteúdo será carregado aqui.</p>
      </div>
    </div>
  </div>
</div>
```

16. Criar `src/app/app.component.ts`:

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  template: ''
})
export class AppComponent {}
```

## Fase 6 — HTML e Estilos

17. Editar `src/index.html`:

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title>Finance App</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/x-icon" href="favicon.ico" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <app-root></app-root>
    <script src="es-module-shims.js"></script>
  </body>
</html>
```

18. Editar `src/styles.scss`:

```scss
/* Global Styles */
@import 'primeng/resources/themes/aura-light/theme.css';
@import 'primeng/resources/primeng.css';
@import 'primeicons/primeicons.css';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Poppins', sans-serif;
  background-color: #f9fafb;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
```

## Fase 7 — Configuração de Testes

19. Editar `karma.conf.js`:

```javascript
module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {},
      clearContext: false
    },
    jasmineHtmlReporter: {
      suppressAll: true
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/finance-mf'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' }
      ]
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['EdgeHeadless'],
    singleRun: false,
    restartOnFileChange: true
  });
};
```

20. Criar `src/app/pages/finance/finance.component.spec.ts`:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinanceComponent } from './finance.component';
import { MessageService } from 'primeng/api';

describe('FinanceComponent', () => {
  let component: FinanceComponent;
  let fixture: ComponentFixture<FinanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceComponent],
      providers: [MessageService]
    }).compileComponents();

    fixture = TestBed.createComponent(FinanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

21. Criar `src/app/entry.component.spec.ts`:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EntryComponent } from './entry.component';
import { provideRouter } from '@angular/router';

describe('EntryComponent', () => {
  let component: EntryComponent;
  let fixture: ComponentFixture<EntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntryComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(EntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

---

## Fase 8 — Configuração Finalização

22. Configurar `package.json` scripts (já devem estar com os padrões, verificar):

```json
"scripts": {
  "ng": "ng",
  "start": "ng serve",
  "build": "ng build",
  "test": "ng test",
  "lint": "ng lint"
}
```

## Fase 9 — Configuração Tailwind CSS

22. Criar/editar `tailwind.config.js` na raiz do projeto:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**Explicação:**
- `content`: Tailwind procura classes em templates HTML e arquivos TypeScript
- `preflight: false`: Desabilita reset CSS (PrimeNG já tem seus próprios estilos)
- Extensível com tema customizado

23. Criar `.editorconfig` na raiz do projeto (opcional mas recomendado):

```
# Editor configuration, see https://editorconfig.org
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.ts]
quote_type = single
ij_typescript_use_double_quotes = false

[*.md]
max_line_length = off
trim_trailing_whitespace = false
```

**Explicação:**
- Garante consistência de espaçamento e formatação em todo o projeto
- Padrão: 2 espaços, UTF-8, quebra de linha ao final
- TS: aspas simples
- MD: sem limite de linha

## Fase 10 — Containerização com Docker

24. Criar `.dockerignore` na raiz do projeto:

```
node_modules
dist
.git
.angular
*.md
```

**Explicação:**
- Exclui pastas e arquivos desnecessários do build context do Docker
- Reduz tamanho da imagem e tempo de build

25. Criar `Dockerfile` na raiz do projeto:

```dockerfile
# ── Stage 1: Build ──────────────────────────────────────────────
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
ARG CONFIG=production
RUN npm run build -- --configuration ${CONFIG}

# ── Stage 2: Serve ──────────────────────────────────────────────
FROM nginx:1.27-alpine

COPY --from=builder /app/dist/finance-mf/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**Explicação:**
- Stage 1: Build da aplicação Angular (Node 24-alpine)
- Stage 2: Cópia dos arquivos compilados para nginx e setup de servidor

26. Criar `nginx.conf` na raiz do projeto:

```nginx
server {
  listen 80;
  server_name _;
  root /usr/share/nginx/html;
  index index.html;

  # Compressão
  gzip on;
  gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;

  # Serve SPA — redireciona tudo para index.html
  location / {
    try_files $uri $uri/ /index.html;
    add_header Access-Control-Allow-Origin "*" always;
    add_header Access-Control-Allow-Methods "GET, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Origin, Content-Type, Accept" always;
  }

  # Cache longo para assets com hash
  location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Access-Control-Allow-Origin "*" always;
    add_header Access-Control-Allow-Methods "GET, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Origin, Content-Type, Accept" always;
  }

  # Sem cache para index.html
  location = /index.html {
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    add_header Access-Control-Allow-Origin "*" always;
    add_header Access-Control-Allow-Methods "GET, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Origin, Content-Type, Accept" always;
  }
}
```

**Explicação:**
- SPA routing: Tudo redireciona para index.html
- GZIP compression ativado
- CORS headers configurados
- Cache de 1 ano para assets com hash
- Sem cache para index.html

27. Criar `docker-compose.yml` na raiz do projeto:

```yaml
services:
  finance-mf:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: finance-mf
    ports:
      - "4202:80"
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

**Explicação:**
- Serviço `finance-mf` constrói a imagem via Dockerfile
- Mapeia porta local 4202 → porta 80 do container (nginx)
- Conectado à rede `app-network` (para comunicação com shell e outros remotes)

## Fase 11 — Verificação e Execução

Após todas as fases, testar com:

```bash
# Desenvolvimento
npm start
# Abre em http://localhost:4202

# Build
npm run build
# Gera em dist/finance-mf/browser

# Testes (requer Chrome/Edge instalado)
npm test

# Docker — Build da imagem
docker build -t finance-mf:latest .

# Docker — Execução via docker-compose
docker-compose up
# Abre em http://localhost:4202 (via nginx no container)
```

**O remote estará pronto para ser carregado pelo shell via:**
```typescript
loadRemoteModule({
  remoteName: 'finance-mf',
  exposedModule: './Component',
  shareScope: 'default'
})
```
