<!--
 * @Author: xudesong jake2020520@gmail.com
 * @Date: 2025-08-14 17:05:53
 * @LastEditors: xudesong jake2020520@gmail.com
 * @LastEditTime: 2025-08-16 15:34:29
 * @FilePath: /full-stack-school-main/readme/readmee.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

### 1、数据方面的配置

#### 1.1 [下载 docker](https://www.docker.com/)

#### 1.2 启动 docker

#### 1.3 下载 postgres 镜像

#### 1.4 运行 postgres 容器

![postgres](./postgres.jpg)

#### 1.5 配置环境变量

新建.env 配置：
DATABASE_URL=postgresql://lamadev:lama123456@localhost:5432/school

#### 1.6 安装 prisma

- npx prisma init 初始化 prisma

#### 1.7 写 schema.prisma 模型 并且迁移数据

- npx prisma migrate dev --name init 迁移数据库 是 Prisma Migrate 的核心命令，用于创建并应用数据库迁移
  schema.prisma 写的模型，会根据模型生成数据库表
  --name init 参数指定迁移名称
- npx prisma studio 打开 prisma studio 查看数据库

#### 1.7 写 seed.ts 初始化数据库数据

- npx prisma db seed 初始化数据库数据
- npx prisma migrate reset 重置数据库

#### 1.8

注释：
npx prisma db push 和 npx prisma migrate dev 是 Prisma 中用于同步数据库结构的两个核心命令

- npx prisma db push ：将 Prisma 模型的当前状态直接同步到数据库，不创建迁移文件。
- npx prisma migrate dev ：创建并应用数据库迁移，同时将模型的当前状态同步到数据库。

### 2、登录方面的配置

#### 2.1 [dashboard.clerk](https://dashboard.clerk.com/apps)上注册账号 google 浏览器账号

- [dashboard.clerk 的文档](https://clerk.com/docs)

#### 2.2 创建应用 并且配置环境变量

- 2.2.1 创建应用
- 2.2.2 配置环境变量 .env 里面
  copy api key(从 clerk 应用里面复制 在 configure 里面) 到 .env 里面
  ```
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_Y2hhcm1lZC1waXBlZmlzaC01OC5jbGVyay5hY2NvdW50cy5kZXYk
  CLERK_SECRET_KEY=sk_test_5ZkGTcuwh1dgkiL8UjHQ1rz6orSWClyXvQeHBoqUQs
  ```
  - 2.2.3 创建用户 并且配置用户角色
    ![clerk_user](./clerk_use.png)
    ![clerk_role](./clerk_role.png)
  - 2.2.4 配置 Sessions 策略
    ![clerk_sessions](./clerk_sessions.png)

### 3、用 clerk 里面的账号登录，就可以访问项目了

    - 3.1 登录clerk 账号
    - 3.2 登录项目
    - 3.3 登录项目的页面 （页面的 添加用户 需要注释掉 调用clerk里面的api，因为那个是付费的）
