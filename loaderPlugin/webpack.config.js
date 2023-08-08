const path=require("path")
module.exports={
    entry:"./src/index.js",
    mode:"development",
    output:{
        filename:"main.js",
        path:path.resolve(__dirname,"./dist")
    },
    module:{
        rules:[
            {
                test:/\.js$/,
                use:[{
                    loader:path.resolve(__dirname,"./loaders/repalceload.js"),
                    options:{
                        name:"geyao"
                    }
                }]
               
            }
        ]
    }
}