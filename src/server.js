const app = require('./app');
const Config = require('./config');

const port = Config.PORT || 9000;
app.listen(port, () => console.log(`App running on port ${port}...`));
