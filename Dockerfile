FROM node:10

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . /usr/src/app

# install project dependencies
RUN npm install

# build app for production with minification
RUN npm run build

EXPOSE 3000
CMD [ "npm", "run", "serve" ]