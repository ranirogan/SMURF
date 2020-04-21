export default class Interpreter{
    visit(node){
        return node.accept(this)
    }

    visitBinOp(node){
        let left = node.left.accept(this)
        let right = node.right.accept(this)
        switch(node.op){ 
            case "-":
                return left - right
            case "+":
                return left + right
            case "/":
                return left / right 
            case "*":
                return left * right
            case "==":
                return left == right
            case "!=":
                return left != right
            case ">=":
                return left >= right
            case ">":
                return left > right
            case "<=":
                return left <= right
            case "<":
                return left < right

        }
    }

    visitInteger(node){
        return node.value
    }

    constructor(target, printFunction){
        this.binding = new Map()
    }

    Assignment(node){
        let variable = node.variable.accept(this)
        let expr = node.expr.accept(this)
        this.setVariable(variable, expr)
        return expr
    }

    VariableName(node){
        return node.name
    }

    setVariable(name, value){
        this.binding.set(name, value)
    }

    IfStatement(node){
        console.log("IF ACCEPT PT 2", node.predicate, node.thenCode)
        let isTrue = node.predicate.accept(this)
        if(isTrue)
            return node.thenCode.accept(this)
        else
            return node.elseCode.accept(this)
    }
}

