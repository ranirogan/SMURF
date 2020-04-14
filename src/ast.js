export class BinOP{
    constructor(l, op, r){
        this.left = l
        this.op = op
        this.right = r
        console.log("binOP ctr", l, op, r)
    }
    accept(visitor){
        return visitor.visitBinOp(this)
    } 
}

export class Integer{
    constructor(value){
        console.log("int ctr", value)
        this.value = value
        console.log("int this", this)
    }

    accept(visitor){
        return visitor.visitInteger(this)
    }
}