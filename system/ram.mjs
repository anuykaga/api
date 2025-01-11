export default async function (req, res) {
    const ram = process.memoryUsage().rss / (1024 * 1024);  
    //console.log(ram)
    res.json({
       ramUsage: ram
    });
}
