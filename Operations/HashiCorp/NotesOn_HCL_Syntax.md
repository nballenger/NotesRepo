# Notes on HCL Syntax

From [https://github.com/hashicorp/hcl2/blob/master/hcl/hclsyntax/spec.md](https://github.com/hashicorp/hcl2/blob/master/hcl/hclsyntax/spec.md)

* Designed to support multiple concrete syntaxes
* Native syntax is considered the primary format and is optimized for human authoring and maintenance
* Language has three integrated sub-languages:
    * Structural language - defines overall hierarchical structure, is a serialization of HCL bodies, blocks, and attributes
    * Expression language - expresses attribute values, as literals or derivations
    * Template language - composes values together into strings
* Structural language is the top level
* Expression and template languages can be used in isolation for things like REPLs, debuggers, etc.

## Syntax Notation

Conventions used in this document (the spec, not this summary), are:

* Naked name with uc first is a global production, common to all syntax specs
* Naked name with lc first is a local, so only in the spec where it's defined
* Double and single quotes mark literal character sequences
* Default operator for combining items is concat, which has no punctuation
* Pipe symbol indicates either/both left and right operands may be present
* Asterisk indicates zero or more repetitions of left operand
* Question mark indicates zero or one of left operand
* Parens group items to apply pipe, asterisk, question mark operators

## Source Code Representation

* Unicode text in UTF-8.
* Language does not do unicode normalization, though string literals have some special handling WRT unicode normalization.
* Invalid or non-normalized UTF-8 is always a parse error.

## Lexical Elements

### Comments and Whitespace

* Comments and whitespace are lexical elements, but are largely ignored
* Horizontal tab characters (U+0009) are NOT whitespace and not valid HCL.
* Comments
    * Line comments: start with `//` or `#`, end at next newline
    * Inline comments: between `/* ... */`, may have any chars but ending sequence
* Comments and whitespace cannot begin within other comments, or within template literals, except inside an interpolation sequence or template directive.

### Identifiers

* Identifiers name entities like blocks, attributes, and expression vars.
* Naming: first character must be a letter or underscore, all following may be alphanumeric, underscore, or dash.

### Keywords

* There are no globally reserved words.
* In some context certain identifiers are reserved as keywords.
* Outside those situations, the keywords have no special meaning.

### Operators and Delimiters

The following are operators, delimiters, and other special tokens:

```
+ - * / %
&& || !
== !=
< > <= >=
: ?
{ } [ ] ( )
= =>
. , ...
${ } %{ }
```

### Numeric Literals

A numeric literal is a decimal representation of a real number, with an integer part, fractional part, and exponent part.

```
1
1.0
1.0E5
1.0e5
1.0E-5
1.0e-5
```

## Structural Elements

* The structural language has syntax representing these constructs:
    * Attributes - assign a value to an identifier
    * Blocks - create a child body annotated by a type and optional labels
    * Body Content - collection of attributes and blocks
* Those correspond to concepts in the HCL information model:

    ```
    ConfigFile   = Body;
    Body         = (Attribute | Block | OneLineBlock)*;
    Attribute    = Identifier "=" Expression Newline;
    Block        = Identifier (StringLiteral|Identifier)* "{" Newline Body "}" Newline;
    OneLineBlock = Identifier (StringLiteral|Identifier)* "{" (Identifier "=" Expression)? "}" Newline;
    ```

* A configuration file is a sequence of characters whose top-level is interpreted as a `Body`
* A body is a collection of associated attributes and blocks
* An attribute definition assigns a value to a particular attribute name in a body. Each distinct attribute name may be defined no more than once in a single body. The attribute value is given as an expression that will be evaluated by the calling application.
* A block creates a child body that is annotated with a block type and zero or more block labels. Blocks create a structural hierarchy that can be interpreted by the calling application. Block labels may be quoted string literals or naked identifiers.

## Expressions

* Used within attribute definitions to specify values.

    ```
    Expression = (
        ExprTerm |
        Operation |
        Conditional
    );
    ```

* Value types are those defined in the HCL info model
* Expressions may return any valid type, but only a subset of the available types have first-class syntax.
* A calling app may make other types available via variables and functions.
* Expression terms are operands for unary and binary ops, and may be expressions themselves

    ```
    ExprTerm = (
        LiteralValue |
        CollectionValue |
        TemplateExpr |
        VariableExpr |
        FunctionCall |
        ForExpr |
        ExprTerm Index |
        ExprTerm GetAttr |
        ExprTerm Splat |
        "(" Expression ")"
    );
    ```

* Inside a parenthetical sub-expression, newline characters are ignored as whitespace.
* Literal values represent a particular value of a primitive type

    ```
    LiteralValue = (
        NumericLiteral |
        "true" |
        "false" |
        "null"
    );
    ```

* Numeric literals are of type `number`
* True and false keywords are type `bool`
* The null keyword is a null value of the dynamic pseudo-type
* String literals are not directly available in the expression sublanguage, but are available via the template sub-language, which can be incorporated via template expressions
* Collection values combine zero or more other expressions to produce a collection value:

    ```
    CollectionValue = tuple | object;
    
    tuple = "[" (
        (Expression ("," Expression)* ","?)?
    ) "]";

    object = "{" (
        (objectelem ("," objectelem)* ","?)?
    ) "}";

    objectelem = (Identifier | Expression) "=" Expression;
    ```

* Only tuple and object values can be directly constructed via native syntax.
