module.exports = {
  DB_NAME: "mba_db",
  DB_URL:
    process.env.MONGODB_URI ||
    `mongodb+srv://${process.env.USERNAME_1}:${process.env.PASSWORD}@cluster0.1gsmies.mongodb.net/Updated_mba_db`,
};

// mongodb+srv://pankajsondhiya414:aX5gKHof9IrynuLX@cluster0.1gsmies.mongodb.net/mba_db
