# Pokemon Roundest App With NextJs, Typescript, Prisma

Only local development due to requirement of planetScale
requiring a pay plan for multiple db required here.
One of dev and one for "shadow".

## Code History

The code in this repository is based on the
[Building a MODERN Full Stack App](https://youtu.be/PKy2lYEnhgs)
video.

Next JS setup following https://tailwindcss.com/docs/guides/nextjs

```bash
npx create-next-app --ts # name next-round-mon
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p # edit tailwind.config.js and global.css
# setup vscode tailwindcss and ts support by following
# https://dev.to/papaponmx/how-to-enable-tailwind-intellisense-on-tsx-files-230b
yarn add @trpc/client @trpc/server @trpc/react @trpc/next zod react-query
# move pages to src directory and modify tailwind.config.js
```

```bash
npx prisma init
sudo apt install ./pscale_0.102.0_linux_amd64.deb
pscale auth login
pscale connect roundest-mon main --port 3309
pscale connect roundest-mon dev --port 3310
# update .env with dbs
npx prisma migrate dev
npx prisma studio
```
