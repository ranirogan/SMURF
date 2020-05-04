function bool(value) {
  return value ? 1 : 0
}

const operations = {
  "+": (l, r) => l + r,
  "-": (l, r) => l - r,
  "*": (l, r) => l * r,
  "/": (l, r) => Math.round(l / r),

  "<":  (l,r) => bool(l < r),
  "<=": (l,r) => bool(l <= r),
  "==": (l,r) => bool(l == r),
  ">=": (l,r) => bool(l >= r),
  ">":  (l,r) => bool(l > r),
  "!=": (l,r) => bool(l != r),

}

import Binding from "../binding.js"
import * as AST from "../ast.js"

export default class Interpreter {

  constructor(target, printFunction) {
    this.target = target
    this.printFunction = printFunction
    this.binding = new Binding()
  }

  visit() {
    return this.target.accept(this)
  }

  Assignment(node) {
    // console.log("Assign")
    let variable = node.variable.accept(this)
    let expr     = node.expr.accept(this)
    this.binding.updateVariable(variable, expr)
    return expr
  }

  BinOp(node) {
    // console.log("binop", node)
    let l = node.l.accept(this)
    let r = node.r.accept(this)
    return operations[node.op](l, r)
  }

  FunctionCall(node) {
    // console.log("func call", node.name)
    let thunk = node.name.accept(this)
    // console.log("thunk:", thunk)
    let binding = thunk.binding.push()
    let args = node.args
    if(args.length != thunk.formals.length)
        throw new Error(`Invalid parameter list for function`)
    for(let i = 0; i < args.length; i = i + 1){
      try{
        var val = args[i].accept(this)
      }
      catch{
        val = this.binding.getVariableValue(args[i])
      }
        binding.setVariable(thunk.formals[i], val)
    }
    let temp = this.binding
    this.binding = binding
    let ret = thunk.code.accept(this)
    thunk.binding = this.binding
    this.binding = temp
    return ret
  }

  FunctionDefinition(node) {
    // console.log("fun def", node)
    return new AST.Thunk(node.formals, node.code, this.binding)
  }

  IfStatement(node) {
    // console.log("if")
    let predicate = bool(node.predicate.accept(this))

    if (predicate == 1)
      return node.thenCode.accept(this)

    return node.elseCode.accept(this)
  }

  IntegerValue(node) {
    // console.log("int")
    return node.value
  }

  InternalPrint(node) {
    // console.log("internal print")
    let args = node.args.map(a => a.accept(this).toString() )
    this.printFunction(args)
    return args
  }

  StatementList(node) {
    // console.log("statement list")
    let result = 0
    node.statements.forEach(statement =>
      result = statement.accept(this)
    )
    return result
  }

  VariableDeclaration(node) {
    // console.log("var dec")
    let variable = node.variable.accept(this)
    let initialValue = 0
    if (node.initialValue) {
      initialValue = node.initialValue.accept(this)
    }
    this.binding.setVariable(variable, initialValue)
    return initialValue
  }

  VariableName(node) {
    // console.log("var name")
    return node.name
  }

  VariableValue(node) {
    // console.log("var val")
    return this.binding.getVariableValue(node.name)
  }
}