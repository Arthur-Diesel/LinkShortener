<h1>Link Shortener</h1>
<h2>Possui o objetivo de criar, remover e atualizar URLs abreviadas.</h2>

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

Após isso, você conseguirá rodar o projeto através do comando:

```bash
npm run dev
```

## Como escalar verticalmente?

É possível definir um balanceador de carga, como por exemplo o ELB (Amazon Elastic Load Balancer), dessa forma, passando parte das requisições para outros nós.
Ou, através de uma aplicação intermediária, que recebe a requisição, a coloca em uma fila para ser consumida através de um processo assíncrono, o que tem como ponto negativo a falta de um retorno imediato e um processo mais trabalhoso, mas, que pode também, gerar uma tolerância maior a falhas.