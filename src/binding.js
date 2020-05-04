export default class Binding {
  constructor(parent = null) {
    this.binding = new Map()
    this.parent = parent
  }

  getVariableValue(name) {
    // console.log("Get Var Val binding", name)
    this.checkVariableExists(name)
    let temp = this.binding.get(name)
    if(temp == null)
      return this.parent.getVariableValue(name)
    else
      return temp
  }


  setVariable(name, value) {
    // console.log("set var binding", name, value)
    // console.log("binding", this.binding)
    if (this.binding.has(name)){
      throw new Error(`Duplicate declaration for variable`)
    }
    else
      this.binding.set(name, value)
  }

  updateVariable(name, value) { //needs to look at parent as well?
    // console.log("update var", name, value)
    this.checkVariableExists(name)
    this.binding.set(name, value)
  }

  checkVariableExists(name) { //needs to look at parent as well
    // console.log("check var exists", name)
    if (!this.binding.has(name)){
      let parent = this.pop()
      if(parent == null){
        throw new Error(`Reference to unknown variable ${name}`)
      }
      else
        parent.checkVariableExists(name)      
    }
  }

  push(){
    // console.log("return new binding whose parent is this binding", this)
    return new Binding(this)
  }

  pop(){
    // console.log("return parent of this binding", this)
    return this.parent
  }
}