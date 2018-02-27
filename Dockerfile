FROM siomiz/node-opencv

WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn
COPY . .

EXPOSE 8000
CMD [ "yarn", "start" ]