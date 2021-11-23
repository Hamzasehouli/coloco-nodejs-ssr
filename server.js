const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

process.on('uncaughtException', () => {
  console.log('wrong expression');
});

dotenv.config({ path: './config.env' });

mongoose
  .connect(process.env.DATA_BASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB is successfully connected'));

// process.on("unhandledRejection", () => {
//   console.log("promise rejection");
// });

app.listen(8000, () => console.log('server is running'));
