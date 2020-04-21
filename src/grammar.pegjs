{
  const AST = options.AST
}
start
  = code
identifier
  = [a-z]([a-z][A-Z][0-9]_)*
///////////////////////////////////////////////////////////////////////////////////////////////////
code
  = term:statement
  {return term}

statement
  = "let" _ variable_declaration
  / term:assignment
  {return term}
  / term:expr
  {return term}

///////////////////////////////////////////////////////////////////////////////////////////////////
variable_declaration
  = _ left:variable_name _ "=" _ right:expr _
  {return new AST.Assignment(left, right)}
  / term:variable_name
  {return new VariableName(id)}

variable_value
  = id:identifier
  {return new AST.VariableValue(id)}

variable_name
  = id:identifier
  {return new AST.VariableName(id)}

///////////////////////////////////////////////////////////////////////////////////////////////////
if_expression
  = _ predicate:expr _ thenCode:brace_block _ "else" _ elseCode:brace_block _
  {return new AST.IfStatement(predicate, thenCode, elseCode)}
  / predicate:expr _ elseCode:brace_block
  {return new AST.IfStatement(predicate, elseCode, "")}

///////////////////////////////////////////////////////////////////////////////////////////////////
assignment
  = left:variable_name _ "=" _ right:expr
  {return new AST.Assignment(left, right)}
///////////////////////////////////////////////////////////////////////////////////////////////////
expr
  = "fn" _ function_definition
  / _ "if" _ term:if_expression
  {return term}
  / term:boolean_expression
  {return term}
  / term:arithmetic_expression
  {return term}
///////////////////////////////////////////////////////////////////////////////////////////////////
boolean_expression
  = _ head:arithmetic_expression _ rest:(relop right:arithmetic_expression)* _
  {return rest.reduce((result, [op, right])=>
    new AST.BinOp(result, op, right), head)
      }
///////////////////////////////////////////////////////////////////////////////////////////////////
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
	= _ "(" _ exp:arithmetic_expression _ ")" _
    {return exp}
    / integer
    / function_call                  // I”ve commented these
    / variable_value                 // two out for now
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
///////////////////////////////////////////////////////////////////////////////////////////////////
function_call
  = variable_value _ "(" _ ")" _
///////////////////////////////////////////////////////////////////////////////////////////////////
function_definition
  = param_list brace_block
param_list
  = "(" ")"
brace_block
  = _ "{" _ term:code _ "}" _
  {return term}
///////////////////////////////////////////////////////////////////////////////////////////////////
space
  = [ \t\n\r]
_
 = space*