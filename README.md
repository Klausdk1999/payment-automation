# Micro Serviço - Brasão Licenses

Inicie clonando o repositório e criando o seu arquivo .env baseado no .env.example

Comandos:
- **npm run build** - Faz a build do projeto
- **npm start** - Inicia o projeto gerado na build
- **npm run dev** - Inicia a versão de desenvolvimento do servidos: não executa build e atualiza em tempo real as mudanças feitas no código.


- **npx prisma studio** - Abre a interface visual do prisma que permite visualizar o banco
- **npx prisma db push** - Atualiza o banco de dados para seguir a estrutura definida no prisma
- **npx prisma db seed** - Roda o seed com o usuario principal
- **npx prisma generate** - Faz o prisma atualizar suas entidades com base no arquivo schema.prisma
- **npx prisma migrate dev** - Gera migration baseado nas definições do schema.prisma
- **npx prisma migrate reset** - Reseta o banco, limpando todos os dados e aplicando as migrations e seed.

# Docker
- Primeiro executar somente db, e rodar prisma migrate dev e prisma db seed

- Depois compose normal

- docker build -t bpm-licenses .

 - docker run -p 3001:3001 bpm-licenses

.env para docker-compose do projeto todo:
 - DATABASE_URL="postgres://postgres:postgres@db-licenses:5432/licenses?schema=public"

.env para docker-compose do licenses:
- DATABASE_URL="postgres://postgres:postgres@database:5432/docker?schema=public"

# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
