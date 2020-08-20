FROM node:14-alpine AS build

# Create app directory
WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:14-alpine

# Create app directory
WORKDIR /home/node/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install --production

# copy bundle from build
COPY --from=build /home/node/app/build ./build

# switch to user node (uid=1000)
USER node

CMD [ "npm", "run", "service"]
