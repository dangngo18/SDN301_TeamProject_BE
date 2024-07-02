const express = require('express');
const mongoose = require('mongoose');
const bodyparse = require('body-parser');
const auth = require('./routes/authRoute')
const UserRoute = require('./routes/userRoute')
const studioRoute = require('./routes/studioRoute')
const styleRoute = require('./routes/styleRoute')
const app = express();
const cors = require('cors');
const url="mongodb://127.0.0.1:27017/ProjectServer"
const port = 8080

mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err))

app.use(bodyparse.json());
app.use(cors());
app.use(bodyparse.urlencoded({extended:true}));


app.use('/auth', auth)
app.use('/user', UserRoute)
app.use('/studio', studioRoute)
app.use('/style', styleRoute)

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})