version: '3.7'

services:
  server:
    build:
      context: ./server
      dockerfile: Dockerfile
    image: myapp-server
    container_name: myapp-node-server
    command: /usr/src/app/node_modules/.bin/nodemon server.js
    volumes:
      - ./server/:/usr/src/app
      - /usr/src/app/node_modules
    ports:
      - "5000:5000"
    depends_on:
      - mongo
    env_file: ./server/.env
    environment:
      - NODE_ENV=development
    networks:
      - app-network
  mongo:
    image: mongo
    volumes:
      - data-volume:/data/db
    ports:
      - "27017:27017"
    networks:
      - app-network
  client:
    build:
      context: ./client
      dockerfile: Dockerfile
    image: myapp-client
    container_name: myapp-react-client
    command: npm start
    volumes:
      - ./client/:/usr/app
      - /usr/app/node_modules
    depends_on:
      - server
    ports:
      - "3000:3000"
    networks:
      - app-network

networks:
    app-network:
        driver: bridge

volumes:
    data-volume:
    node_modules:
    web-root:
      driver: local
