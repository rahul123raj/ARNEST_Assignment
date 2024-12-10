const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()
app.use(cors())
app.use(express.json())

const URL = process.env.MONGO_URL

const connectdb = async () =>{
    await mongoose.connect(URL)
    console.log("database is connected")
}
connectdb()

let formSchema = mongoose.Schema(
    {   
        imgurl: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        mobno: {
            type: Number,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        branch: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

let formModel = mongoose.model('Form',formSchema)

const getData = async (req,res) =>{
    try {

        const { q ,sortBy,sortDirection, filters} = req.query;

        let filter = {};
        let sort = {}
        let selectedFields = {}

        if (q) {
            filter = {
                $or: [
                    { name: { $regex: q, $options: 'i' } }, 
                    { email: { $regex: q, $options: 'i' } }, 
                    { $expr: { $regexMatch: { input: { $toString: "$mobno" }, regex: q, options: "i" } } } 
                ]
            };
        }

          
          if (sortBy && (sortBy === 'name' || sortBy === 'mobno')) {
            
            const direction = sortDirection === 'DESC' ? -1 : 1;
            sort[sortBy] = direction;
        } else {
            
            sort = { createdAt: 1 }; 
        }

        if (filters) {
            const filterArray = filters.split(','); 
            filterArray.forEach((field) => {
                selectedFields[field] = 1; 
            });
        }
        

        let payload = await formModel.find(filter).select(selectedFields).sort(sort)
        res
        .status(200)
        .json({
            success: true,
            message: 'data is fetched',
            payload
        })
    } catch (error) {
        console.log(error)
    }
}

app.get('/api/employees',getData)

const PORT = process.env.PORT

app.listen(PORT,()=>{
    console.log('server is started '+`http://localhost:${PORT}`)
})