FROM node

# Create app directory
WORKDIR /app

COPY package*.json ./

#  Install app dependencies
RUN npm install

CMD ["node", "./bot.js"]