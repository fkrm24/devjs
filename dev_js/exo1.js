const { rejects } = require("assert");
const { error } = require("console");
const { resolve } = require("path");

function getUserId(id){
    return new Promise((resolve,rejects)=>{
        setTimeout(()=>{
            if (id===1){
                resolve({id:1,name:"john Doe"});
            }else{
                rejects(new Error("User not found"));
            }
        },1000);
    });

}
getUserId(1)
.then(user=>console.log(user))
.catch(error=>console.error(error));