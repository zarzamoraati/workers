import express from "express"
import {Worker} from "node:worker_threads"


const app=express()
app.use(express.json())



function fibonacci(n){
    if(n <= 1) return n

    return fibonacci(n-1) + fibonacci(n-2)
}


app.get("/api/home",async (req,res)=>{
    try{
        const value=req.body.value
        return res.json({msg:"HELLO WORLD"})
    }catch(e){
        return res.status(500).json(e)
    }
})


app.get("/api/fibo/block/:value",async (req,res)=>{
    try{
      const value=req.params.value
      
      const result=fibonacci(value)
      return res.json(result)
         
    }catch(e){
        return res.status(500).json(e)
    }
})

app.get("/api/fibo/no_block/:value",async (req,res)=>{
    const value=req.params.value
    console.log(value)
    if(!value){
        const err=new Error("Field 'value' in request body can't be empty")
        return res.status(401).json(err)
    }
    const worker=new Worker("./worker.js",{workerData:value})
    worker.on("message",(result)=>{
        return res.status(200).json({"fobonacci":result})
    })
    
})



app.listen(3000,()=>console.log("SERVER RUNNING ON PORT ",3000))
