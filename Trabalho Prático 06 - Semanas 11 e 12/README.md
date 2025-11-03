# Projeto: Back-end com CRUD no JSONServer

Este projeto tem como objetivo simular um ambiente de desenvolvimento completo, utilizando Node.js e JSON Server para criar uma API RESTful local e implementar o ciclo CRUD (Create, Read, Update, Delete) com JavaScript e a API Fetch no Front-end.

## ⚙️ Configuração e Inicialização

1.  **Pré-requisitos:** Node.js instalado.
2.  **Instalação:** `npm install json-server`
3.  **Execução:** `npm start` (ou o comando configurado no `package.json`)

## 🧱 Estrutura de Dados (`db/db.json`)

A entidade principal utilizada foi **Produtos**.

```json
{
  "produtos": [
    {
      "id": 1,
      "nome": "Smartphone X",
      "preco": 2500.00,
      "descricao": "Modelo avançado com câmera de 108MP."
    },
    {
        "id": 2,
        "nome": "Notebook Z",
        "preco": 4800.00,
        "descricao": "Processador i7, 16GB RAM, ideal para desenvolvimento."
    }
  ]
}