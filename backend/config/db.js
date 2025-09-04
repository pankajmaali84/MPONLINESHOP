
const mongoose = require('mongoose');


const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    // Safe debug: extract user, host, and db without exposing password
    if (uri) {
      try {
        // Example uri: mongodb+srv://user:pass@host/dbname?params
        const withoutProto = uri.replace(/^mongodb(\+srv)?:\/\//, '');
        const [authAndHost, rest] = withoutProto.split('/', 2); // authAndHost = user:pass@host
        const dbName = rest ? rest.split('?')[0] : '';
        const [auth, host] = authAndHost.split('@');
        const user = auth && auth.includes(':') ? auth.split(':')[0] : undefined;
        console.log(`MongoDB connecting -> user: ${user || 'N/A'}, host: ${host || 'N/A'}, db: ${dbName || 'N/A'}`);
      } catch (_) {
        // ignore parse errors
      }
    }

    await mongoose.connect(uri);
    console.log('MongoDB connected ✅');
  } catch (err) {

    console.log('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
