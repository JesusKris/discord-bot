sleep 60

cd ./src/data 

npx sequelize-cli db:migrate

cd ../

node engine.js