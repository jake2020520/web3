npm i prisma --save-dev
npx prisma init --datasource-provider sqlite --output ../generated/prisma
npx prisma migrate dev