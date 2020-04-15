# Week 1

| Part           | Comments    | Points |
|----------------|-------------|--------|
| 00-test_values | All passed  |     75 |
| 00-test_extras | All passed  |     10 |
| Coding         |             |     25 |
| **TOTAL**      |             |    100 |

Nothing bad to say: good work!

My only slight niggle:

mult_term
	= _ head:primary _ rest:(mulop primary)* _
    {return rest.reduce((result, [op,right])=>new AST.BinOp(result, op, right), head)
      }

could do with some newlines and formatting... :)