FROM node:20.15.1

LABEL authors="robighetti"

WORKDIR /app

COPY package*.json ./

# Configurações para otimizar o npm ci
ENV NODE_ENV=production
ENV NPM_CONFIG_LOGLEVEL=error
ENV NPM_CONFIG_PROGRESS=false

COPY . . 

RUN npm install rollup

RUN npm cache clean --force && npm install && npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
