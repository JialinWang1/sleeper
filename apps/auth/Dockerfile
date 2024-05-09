FROM node:alpine as development

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json tsconfig.json 
COPY nest-cli.json nest-cli.json

RUN npm i -g pnpm
RUN pnpm i

COPY apps/auth apps/auth
COPY libs libs

RUN pnpm run build auth

FROM node:alpine as production

ARG NODE_EVN=production
ENV NODE_EVN=${NODE_EVN}

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm i -g pnpm
RUN pnpm i --prod

COPY --from=development /usr/src/app/dist ./dist

CMD [ "node", "dist/apps/auth/main" ]