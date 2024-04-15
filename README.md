<h1>Link Shortener</h1>
<h2>Possui o objetivo de criar, remover e atualizar URLs abreviadas.</h2>

[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://app.getpostman.com/run-collection/14401295-fbde3a43-cda4-4488-87bb-89749974c802?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D14401295-fbde3a43-cda4-4488-87bb-89749974c802%26entityType%3Dcollection%26workspaceId%3D2754177a-28f7-40e7-aaf7-1e878542c415#?env%5BNew%20Environment%5D=W10=)

## Como rodar o projeto?

# Em modo de desenvolvimento.

Durante o desenvolvimento, foi utilizada a versão 20.12.2, a qual, é a última versão estável do Node.Js, caso você não possua, pode efetuar o download clicando [aqui](https://nodejs.org/en/download/).

Após efetuar o download da última versão, você deve efetuar a instalação dos pacotes através do comando:

```bash
npm install
```

Durante esse processo, você deve definir as **variáveis de ambientes** que são necessárias para o funcionamento do projeto, elas são:

- DATABASE_URL: Que é necessária, para os dados salvos não serem afetados caso a aplicação seja encerrada.
- JWT_SECRET: Que não necessáriamente precisa ser definida, visto que já há um valor padrão pré-definido. Modificará como é gerado o JWT, que é utilizado para manter as sessões ativas.
- PORT: Também, é outro caso de variável que não precisa ser definida, mas pode ser alterada para modificar em qual porta a aplicação ficará exposta.
- DEBUG: Outro  caso de variável opcional, caso seja definida, filtrará quais serão os logs que serão mostrados.

Após isso, você conseguirá rodar o projeto através do comando:

```bash
npm run dev
```

## Como escalar verticalmente?

É possível definir um balanceador de carga, como por exemplo o ELB (Amazon Elastic Load Balancer), dessa forma, passando parte das requisições para outros nós.
Ou, através de uma aplicação intermediária, que recebe a requisição, a coloca em uma fila para ser consumida através de um processo assíncrono, o que tem como ponto negativo a falta de um retorno imediato e um processo mais trabalhoso, mas, que pode também, gerar uma tolerância maior a falhas.