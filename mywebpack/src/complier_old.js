const fs=require("fs")
const parser=require("@babel/parser")

const path = require("path")
const traverse=require("@babel/traverse").default
const {transformFromAst}=require("@babel/core")
module.exports=class Complier{
    constructor(options){
        console.log(options,"options")
       this.entry=options.entry;
       this.output=options.output
    }
    run(){
        this.build(this.entry)
    }
    build(entryFile){
         let content=fs.readFileSync(entryFile,"utf-8")
         const ast=parser.parse(content,{
            sourceType:"module"
         })
         const denpendcies=[]
         traverse(ast,{
            ImportDeclaration({node}){
               // denpendcies.push(node.source.value)
               const dirname=path.dirname(entryFile)
               console.log(dirname,"dirname is")
               const newPath=path.join(dirname,node.source.value)
               console.log(newPath,"newPath is")
               denpendcies[node.source.value]=newPath
            }
         })
       
         const code=transformFromAst(ast,null,{
            presets:["@babel/preset-env"]
         })
         console.log(code,"code is")
    }
}