const express = require('express');
const connectDb = require ('./config/db')
connectDb();
const app = express();

app.use(express.json({extended : false}));
app.get("/", (req, res) => res.send('API Running'))

app.use('/api/users', require('./routes/api/users'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/auth', require('./routes/api/auth'));

const PORT = process.env.PORT || 5007;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));