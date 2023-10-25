try {
  print(`-----${__filename}-----`);
  print(`Creating user ${process.env.BACKEND_MONGO_USER} for database ${process.env.BACKEND_MONGO_SENSOR_DATABASE}`);
  print('----------');
  db = db.getSiblingDB(process.env.BACKEND_MONGO_SENSOR_DATABASE);
  db.createUser({
    user: process.env.BACKEND_MONGO_USER,
    pwd: process.env.BACKEND_MONGO_PASSWORD,
    roles: [{
      role: "readWrite",
      db: process.env.BACKEND_MONGO_SENSOR_DATABASE,
    }],
  });
} catch (error) {
  print(`-----${__filename}-----`);
  print(`Could not create user ${process.env.BACKEND_MONGO_USER}.`);
  print(error);
  print('----------');
}

try {
  print(`-----${__filename}-----`);
  print(`Creating user ${process.env.BACKEND_MONGO_USER} for database ${process.env.BACKEND_MONGO_MODFLOW_DATABASE}`);
  print('----------');
  db = db.getSiblingDB(process.env.BACKEND_MONGO_MODFLOW_DATABASE);
  db.createUser({
    user: process.env.BACKEND_MONGO_USER,
    pwd: process.env.BACKEND_MONGO_PASSWORD,
    roles: [{
      role: "readWrite",
      db: process.env.BACKEND_MONGO_MODFLOW_DATABASE,
    }],
  });
} catch (error) {
  print(`-----${__filename}-----`);
  print(`Could not create user ${process.env.BACKEND_MONGO_USER}.`);
  print(error);
  print('----------');
}
