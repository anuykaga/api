const password = 'riWQlgMAPg7bQMNB'
const url = `mongodb+srv://ruli:${password}@cluster0.h7quu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
const { backup, restore } = require('./mongo.js');
const file_restore = './database.json'
async function Backup(data) {
   const response = await backup(url, data);
   //console.log(response)
   return response
}
/*const data = { 
   users: [],
   keys: [] 
}
Backup(data)*/
async function Restore() {
   const response = await restore(url, file_restore, {
      saveToFile: false
   });
  // console.log(response.log)
   console.log(response.data)
   return response.data
}
module.exports = { Backup, Restore }
