# Server implementation for ShopOnMap application.

## Stack

```
-Express- as web server
-Firebase-firestore- as noSql cloud DB
```

## Build steps

### INSTALLATION

```
1) sudo apt-get update

2) sudo apt-get install mysql-server
3) sudo mysql -u root
3.1) USE mysql
3.2) UPDATE user SET plugin='mysql_native_password' WHERE User='root';
3.3) FLUSH PRIVILEGES;
3.4) exit;

4) wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
4) sudo apt-get install gnupg
4.2) wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
4.3) echo "deb http://repo.mongodb.org/apt/debian buster/mongodb-org/4.4 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
4.4) sudo apt-get update
4.5) sudo apt-get install -y mongodb-org
4.3) sudo service mongod start

5) wget http://download.redis.io/redis-stable.tar.gz
5.1) tar xvzf redis-stable.tar.gz
5.2) cd redis-stable
5.3) make
5.4) sudo cp src/redis-server /usr/local/bin/
5.5) sudo cp src/redis-cli /usr/local/bin/
5.6) redis-server

6) npm install
```
