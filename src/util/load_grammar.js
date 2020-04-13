////////////////////////////////////////////////////////
//              DO NOT CHANGE THIS FILE               //
////////////////////////////////////////////////////////

import fs from "fs"
import path from "path"
import pegjs from "pegjs"


export default function loadGrammar() {
  let grammarFileName = path.join("./src/", "grammar.pegjs")
  let grammarSrc = fs.readFileSync(grammarFileName, "utf-8")

  try {
    return pegjs.generate(grammarSrc, { trace: true })
  }
  catch (e) {
    console.log(`In ${grammarFileName} line ${e.location.start.line} @ ${e.location.start.column}`)
    console.log(e.message)
    process.exit(1)
  }

}
