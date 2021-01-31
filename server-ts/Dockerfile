FROM node:10

WORKDIR /mukul/messenger-app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

ENV MODE=PROD \
    PORT=8080\
    host=db\
    db=messenger\
    user=root\
    DB_PASS=password\
    MONGO_URL=mongodb://mongo/messenger\
    OTP_LIMIT_SECONDS=600\
    JWT_SALT=1f2bf31a6512b4bb0d7cd2b261773f02b2f42b440455c6b1aa9d7d33c870f8aca68ecf0cf10950603f54ef728ff358478d79b7b4c3fbad62da7609135758775e\
    JWT_EXP=84600\
    REDIS_PORT=6379\
    MYSQL_PORT=3306

CMD ["npm", "start"]