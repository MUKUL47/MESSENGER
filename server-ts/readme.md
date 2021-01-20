# Server implementation for ShopOnMap application.

## Stack

```
-Express- as web server
-Firebase-firestore- as noSql cloud DB
```

## Build steps

### npm start later will add docker

```
1) npm install
2) sudo apt-get update

3) sudo apt-get install mysql-server
4) sudo mysql -u root
4.1) USE mysql
4.2) UPDATE user SET plugin='mysql_native_password' WHERE User='root';
4.3) FLUSH PRIVILEGES;
4.4) exit;

5)for mongo installation : https://docs.mongodb.com/manual/tutorial/install-mongodb-on-debian/#install-mongodb-community-edition
5.1) sudo service mongod start

```
