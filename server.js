const { app } = require('./src/routes');
const { env, stdout } = process;
const PORT = env.PORT || 8000;

app.listen(PORT, () => stdout.write(`Listening at PORT: ${PORT}...\n`));
