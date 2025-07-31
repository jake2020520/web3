- npm i prisma --save-dev
- npx prisma init --datasource-provider sqlite --output ../generated/prisma
- npx prisma migrate dev
- npx prisma studio // 简易客户端，添加字段
- npx prisma db push --force-reset

-------------
// https://ui.shadcn.com/docs/components/button
- npx shadcn@latest init
- npx shadcn@latest add button