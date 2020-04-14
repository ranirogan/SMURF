{
  const AST = options.AST
}

arithmetic_expression
	= left:mult_term (op:addop right:mult_term)+
  {return new AST.BinOP(left, op, right)}
  / mult_term

mult_term
	= left:primary op:mulop right:primary
  {return new AST.BinOP(left, op, right)}
  / primary

primary
	= "(" arithmetic_expression ")"
    / integer
  // / function_call                  // I”ve commented these
  // / variable_value                 // two out for now

integer
	= '+' term:digits
    {return new AST.Integer(parseInt(term))}
  / '-' term:digits
    {return new AST.Integer(parseInt(term)*-1)}
  / term:digits
    {return new AST.Integer(parseInt(term))}

digits
	= term:[0-9]+

addop
	= '+' 
  / '-'
  
  
mulop
	= '*' 
  / '/'

space
  = [ \t\n\r]

_
 = space*