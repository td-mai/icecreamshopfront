FROM node:latest AS builder
# Set working directory
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install
# Copy all files from angular app directory to working dir in image
COPY  . .

RUN npm install -g @angular/cli
RUN ng build --configuration production --output-path=/dist

FROM nginx:stable

#copy angular built files
WORKDIR /usr/share/nginx/html
# Remove default nginx static assets
RUN rm -rf ./*
# Copy static assets from builder stage
COPY --from=builder /dist .

# create the appropriate directories
ENV HOME=/usr/src/
ENV APP_HOME=/usr/src/icecreamshop
RUN mkdir $APP_HOME
RUN mkdir $APP_HOME/static
RUN mkdir $APP_HOME/media
WORKDIR $APP_HOME

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/icecreamshop.conf /etc/nginx/conf.d

EXPOSE 80


