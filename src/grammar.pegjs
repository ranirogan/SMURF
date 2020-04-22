{
  const AST = options.AST
}
start
  = code
identifier
  = [a-z]([a-z][A-Z][0-9]_)*
//////////////////////////////////////////////blocks///////////////////////////////////////////////
code
  = term:(statement)+
  {return new AST.StatementList(term)}

statement
  = "let" _ term:variable_declaration
  {return term}
  / term:assignment
  {return term}
  / term:expr
  {return term}

///////////////////////////////////////variables///////////////////////////////////////////////////
variable_declaration
  = _ left:variable_name _ "=" _ right:expr
  {return new AST.Assignment(left, right)}
  / term:variable_name
    {return new AST.Assignment(term, new AST.Integer(0))}

variable_value
  = id:identifier
  {return new AST.VariableValue(id.join(""))}

variable_name
  = id:identifier
  {return new AST.VariableName(id.join(""))}

///////////////////////////////////////////////if//////////////////////////////////////////////////
if_expression
  = _ predicate:expr _ thenCode:brace_block _ "else" _ elseCode:brace_block _
  {return new AST.IfStatement(predicate, thenCode, elseCode)}
  / predicate:expr _ elseCode:brace_block
  {return new AST.IfStatement(predicate, elseCode, "")}

///////////////////////////////////////assignment//////////////////////////////////////////////////
assignment
  = left:variable_name _ "=" _ right:expr
  {return new AST.Assignment(left, right)}
///////////////////////////////////////expression//////////////////////////////////////////////////
expr
  = "fn" _ term:function_definition
  {return term}
  / _ "if" _ term:if_expression
  {return term}
  / term:boolean_expression
  {return term}
  / term:arithmetic_expression
  {return term}
///////////////////////////////////////////boolean/////////////////////////////////////////////////
boolean_expression
  = _ head:arithmetic_expression _ rest:(relop right:arithmetic_expression)* _
  {return rest.reduce((result, [op, right])=>
    new AST.BinOp(result, op, right), head)
      }
////////////////////////////////////////////arith//////////////////////////////////////////////////
arithmetic_expression
	= _ head:mult_term _ rest:(addop mult_term)* _
  {return rest.reduce((result, [op, right])=>
    new AST.BinOp(result, op, right), head)
  }
mult_term
	= _ head:primary _ rest:(mulop primary)* _
    {return rest.reduce((result, [op,right])=>
    new AST.BinOp(result, op, right), head)
      }
primary
	= integer
    / function_call                  // I”ve commented these
    / term:variable_value                 // two out for now
    / _ "(" _ exp:arithmetic_expression _ ")" _
    {return exp}
    
integer
	= _ '+' _ term:digits _
    {return new AST.Integer(parseInt(term.join(""), 10))}
  / _ '-' _ term:digits _
    {return new AST.Integer(parseInt(term.join(""), 10)*-1)}
  / _ term:digits _
    {return new AST.Integer(parseInt(term.join(""), 10))}
digits
	= term:[0-9]+
addop
	= '+'
  / '-'
mulop
	= '*'
  / '/'
relop
  = '=='
  / '!='
  / '>='
  / '>'
  / '<='
  / '<'
///////////////////////////////////////////func call///////////////////////////////////////////////
function_call
  = val:variable_value _ "(" _ ")" _
  {return new AST.FunctionCall(val, "")}
///////////////////////////////////////////func def////////////////////////////////////////////////
function_definition
  = _ param:param_list _ block:brace_block _
  {return new AST.FunctionDefinition(param, block)}
param_list
  = "(" ")"
brace_block
  = _ "{" _ term:code _ "}" _
  {return term}
/////////////////////////////////////////////other/////////////////////////////////////////////////
space
  = [ \t\n\r]
_
 = space*