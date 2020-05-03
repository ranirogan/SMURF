export default class Binding {
  constructor(parent = null) {
    this.binding = new Map()
    this.parent = parent
  }

  getVariableValue(name) {
    console.log("Get Var Val binding", name)
    this.checkVariableExists(name)
    return this.binding.get(name)
  }


  setVariable(name, value) {
    console.log("set var binding", name, value)
    if (this.binding.has(name))
      throw new Error(`Duplicate declaration for variable`)
    this.binding.set(name, value)
    console.log("new bindings", this)
  }

  updateVariable(name, value) { //needs to look at parent as well?
    console.log("update var", name, value)
    // this.checkVariableExists(name)
    // this.setVariable(name, value)
    this.binding.set(name, value)
  }

  checkVariableExists(name) { //needs to look at parent as well
    console.log("check var exists", name)
    if (!this.binding.has(name)){
      let parent = this.pop()
      if(parent == null){
        console.log("this", this)
        throw new Error(`Reference to unknown variable ${name}`)
      }
      else
        parent.checkVariableExists(name)      
    }
  }

  push(){
    console.log("return new binding whose parent is this binding", this)
    return new Binding(this)
  }

  pop(){
    console.log("return parent of this binding", this)
    return this.parent
  }
}