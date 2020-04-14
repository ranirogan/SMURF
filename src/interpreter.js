export default class Interpreter{
    visit(node){
        console.log("test1", node)
        return node.accept(this)
    }

    visitBinOp(node){
        console.log("test", node)
        let left = node.left[1].accept(this)
        let right = node.right[1].accept(this)
        switch(node.op){
            case "+":
                return left + right
            case "*":
                return left * right
        }
    }

    visitInteger(node){
        console.log("test3", node)
        return node.value
    }
}

