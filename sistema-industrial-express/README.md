# Sistema Industrial — Backend Express.js

Migração inicial do backend NestJS/TypeScript para Express.js/JavaScript, mantendo a lógica de simulação e conferência do serviço original.

## Requisitos

- Node.js 18.11 ou superior (recomendado usar uma versão LTS recente)
- npm

## Instalação

No terminal, dentro da pasta `backend` (esta pasta):

```bash
npm install
npm run dev
```

O servidor inicia em `http://localhost:3000`.

## Rotas

### `GET /`
Verifica se a API está ativa.

### `POST /api/conferencia/simular`
Sorteia uma posição de silo para simular a câmera. O campo `totalSilos` é opcional e usa 10 por padrão.

Corpo JSON:

```json
{
  "totalSilos": 10
}
```

### `POST /api/conferencia/validar`
Compara o silo solicitado com a última posição simulada.

Corpo JSON:

```json
{
  "siloSolicitado": 3
}
```

Possíveis estados: `APROVADO`, `DIVERGENTE`, `POSICAO_DESCONHECIDA` e `ERRO`.

## Teste rápido com PowerShell

```powershell
Invoke-RestMethod http://localhost:3000/
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/conferencia/simular -ContentType 'application/json' -Body '{"totalSilos":10}'
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/conferencia/validar -ContentType 'application/json' -Body '{"siloSolicitado":3}'
```

A posição é aleatória e permanece apenas na memória do processo Node.js. Reiniciar o servidor apaga a posição. A confiança `0.98` é fictícia e não representa uma medição real.

## Organização

- `src/server.js`: inicia o servidor HTTP.
- `src/app.js`: configura Express, JSON, CORS e rotas.
- `src/routes/`: declara os endpoints.
- `src/controllers/`: recebe requisições e envia respostas HTTP.
- `src/services/`: contém a lógica de negócio preservada.
- `src/modules/`: pastas reservadas para evoluir os domínios de silos, carrinhos e localização.

## Observação sobre a migração

Esta é uma base funcional da API de conferência, não uma migração de um frontend React. O ZIP original analisado contém o backend NestJS. Banco de dados, leitura real de QR Code, câmera e posição física ainda não estão implementados.
