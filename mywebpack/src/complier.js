const fs = require("fs")
const { getAst, getCode, getDependcies } = require("./parser")
const path = require("path")

module.exports = class Complier {
    constructor(options) {
        console.log(options, "options")
        this.entry = options.entry;
        this.output = options.output;
        this.modules = []
    }
    run() {
        const info = this.build(this.entry)
        this.modules.push(info)
        for (let i = 0; i < this.modules.length; i++) {
            const item = this.modules[i];
            const { denpendcies } = item
            if (denpendcies) {
                for (let j in denpendcies) {
                    this.modules.push(this.build(denpendcies[j]))
                }
            }
        }
        //转换数据结构
        const obj = {}
        this.modules.forEach(item => {
            obj[item.fileName] = {
                denpendcies: item.denpendcies,
                code: item.code
            };
        })
        console.log("obj is", obj)
        this.file(obj)
    }
    build(entryFile) {
        let ast = getAst(entryFile)
        let denpendcies = getDependcies(ast, entryFile)
        let code = getCode(ast)
        return {
            entryFile,
            denpendcies,
            code
        }
    }
    file(code) {
        const filePath = path.join(this.output.path, this.output.filename)
        const newCode = JSON.stringify(code)
        const bundle = `(function(graph){
          
            function require(module){
                function localRequire(relativePath){
                    return require(graph[module].dependencies[relativePath])
                 }
                var exports={}
                (function(require,exports,code){
                    eval(code)
                })(localRequire,exports,graph[module].code)
                return exports;
            }
            require('${this.entry}')
        })(${newCode})`
        fs.writeFileSync(filePath, bundle, "utf-8")
    }
}
 