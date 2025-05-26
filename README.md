# QuickPay
Leia mais sobre em: https://repositorio.ufsc.br/bitstream/handle/123456789/249119/TCC_Klaus___Engenharia_de_Controle_e_Automacao___UFSC_Final_assinado.pdf?sequence=1&isAllowed=y
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
- Primeiro executar somente db, e rodar prisma migrate dev e prisma db seed, para preparar o banco

- Com o banco pronto podemos executar o quickpay com o docker compose completo

- docker build -t quickpay 

- docker run -p 3001:3001 quickpay


.env para docker-compose do quickpay:
- DATABASE_URL="postgres://postgres:postgres@database:5432/quickpay"
