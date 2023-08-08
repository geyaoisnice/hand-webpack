const fs=require("fs")
const parser=require("@babel/parser")

const path = require("path")
const traverse=require("@babel/traverse").default
const {transformFromAst}=require("@babel/core")
module.exports={
    //分析模块 获取AST
    getAst:(fileName)=>{
        let content=fs.readFileSync(fileName,"utf-8")
         return parser.parse(content,{
           sourceType:"module"
        })
    },
    //获取依赖
    getDependcies:(ast,fullName)=>{
        const dependcies=[]
        traverse(ast,{
           ImportDeclaration({node}){
              // denpendcies.push(node.source.value)
              const dirname=path.dirname(fullName)
              console.log(dirname,"dirname is")
              const newPath=path.join(dirname,node.source.value)
              console.log(newPath,"newPath is")
              dependcies[node.source.value]=newPath
           }
        })
        return dependcies
    },
    getCode:ast=>{
        const code=transformFromAst(ast,null,{
            presets:["@babel/preset-env"]
         })
         console.log(code,"code is")
         return code
    }
}