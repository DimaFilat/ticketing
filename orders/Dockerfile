FROM node:alpine
RUN apk --no-cache add curl

WORKDIR /app
COPY package.json .
RUN npm install --silent --only=prod
COPY ./ ./

CMD ["npm", "start"]