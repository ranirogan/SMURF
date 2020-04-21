export class BinOp{
    constructor(l, op, r){
        this.left = l
        this.op = op
        this.right = r
    }
    accept(visitor){
        return visitor.visitBinOp(this)
    } 
}

export class Integer{
    constructor(value){
        this.value = value
    }

    accept(visitor){
        return visitor.visitInteger(this)
    }
}

export class Assignment{
    constructor(l, r){
        this.variable = l
        this.expr = r
    }
    accept(visitor){
        return visitor.Assignment(this)
    }
}

export class VariableName{
    constructor(name){
        this.name = name
    }

    accept(visitor){
        return visitor.VariableName(this)
    }
}

export class IfStatement{
    constructor(predicate, thenCode, elseCode){
        this.predicate = predicate
        this.thenCode = thenCode
        this.elseCode = elseCode
        console.log("IF CTR", this)
    }

    accept(visitor){
        console.log("IF ACCEPT PT 1", this.predicate, this.thenCode)
        return visitor.IfStatement(this)
    }
}