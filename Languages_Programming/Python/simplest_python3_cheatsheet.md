# Simplest Python3 Cheatsheet

* Naming
    * Case sensitive; unicode + underscore; camel or snake acceptable
    * `^[^\d][\w_]*$`
* Types
    * Immutable: `bool`, `int`, `float`, `tuple`, `str`, `frozenset`
    * Mutable: `list`, `set`, `dict`
* Reserved Words
    * `False`, `None`, `True`
    * `and`, `as`, `assert`, `break`, `class`, `continue`, `def`, `del`, `elif`, `else`, `except`
    * `finally`, `for`, `from`, `global`, `if`, `import`, `in`, `is`, `lambda`, `nonlocal`, `not`
    * `or`, `pass`, `raise`, `return`, `try`, `while`, `with`, `yield`
* Truth
    * All objects have a boolean value and may be used in tests
    * Boolean operators stop as soon as a result is determinable
    * True values: `True`, non-zero numbers, non-empty sequences / containers
    * False values: `False`, `0`, `None`, empty sequences / containers
* Comments
    * `# ...` for inline, `""" ... """` for multiline docstrings
* Operators
    * Arithmetic: `+ - * / % ** //`
    * Comparison: `== != <> > >= < <=`
    * Logical: `and or not`
    * Bitwise: `& | ^ ~ >> <<`
    * Set: `| & - ^ in not in < > <= >= ==`
    * Assignment: `= += -= *= /= %= **= //=`
    * Other: `yield lambda if ... else`
* Syntax
    * Blocks: Delimited by preceding whitespace
    * Empty blocks: must use `pass`, the explicit no-op
    * Flow Control
        * Conditionals

				a = True
				b = False

				if a:
				  print "a was True"
				elif b:
				  print "b was True"
				else:
				  print "neither was True"

				c = 1 if a else -1      # if/else oneliner as a ternary expression

		* `while` loops

				a = True

				print "Rolling till we get six!"
				while a:
				  roll = int(random.random() * 6) + 1
				  print roll
				  if roll == 6:
					a = False
				else:
					print "'a' is False now."       # else block executes if you exit without 'break'

				while True:
				  print "Should run once."
				  break
				else:
				  print "This should never print."  # Will not run due to 'break' in loop body

				b = 0
				while b < 10:
				  b += 1
				  if (b % 2) == 1:                  # Uses 'continue' to skip odd numbers
					continue
				  print str(b)

		* `for` loops

				for x in ["a", "b", "c"]:
				  print x

				T = [(1,2), (3,4), (5,6)]
				for (a,b) in T:
				  print(a,b)

				D = {'a': 1, 'b': 2, 'c': 3}
				for key in D:
				  print(key, '=>', D[key])

				for (key, value) in D.items():
				  print(key, '=>', value)
