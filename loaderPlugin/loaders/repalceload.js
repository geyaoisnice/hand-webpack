module.exports=function(source){
    console.log(source,this.query)
    return source.replace("hello","gege")
}