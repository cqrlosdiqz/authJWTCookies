const { connect, connection } = require('mongoose');
const URI = process.env.MONGODB_URI;

(async function dbConnect() {
  try {
    await connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.info('Connected to MongoDB');
  } catch (error) {
    console.error('Error de conexión con MongoDB: ', error.message);
    process.exit(0);
  }
})();

process.on('SIGINT', () => {
  connection.close(() => {
    console.info('Desconexión realizada con MongoDB');
    process.exit(0);
  });
});