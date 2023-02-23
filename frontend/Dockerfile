FROM node:latest
WORKDIR /opt/app
COPY ./package.json ./
COPY ./public ./public
COPY ./src ./src
COPY ./.env ./.env
RUN ls -la
RUN yarn install
# RUN npm install env-cmd --save
CMD ["npm", "start"]
# RUN npm run build
# RUN npm install -g serve
# COPY . .
# CMD ["serve", "-s", "build"]