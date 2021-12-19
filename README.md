# Tag Checker

This project checks that all the tags in a given piece of text (a paragraph) are correctly nested, and that there are no missing or extra tags. An opening tag for this problem is enclosed by angle brackets, and contains *exactly one upper case letter*, for example `<T>`, `<X>`, `<S>`. The corresponding closing tag will be the same letter preceded by the symbol `/`; for the examples above these would be `</T>`, `</X>`, `</S>`.

# Running and testing

Run the example file

`npm run start`

Run the unit tests

`npm run test`

## src/index.js

This contains an example usage of the functions in the project, and handles outputting the desired message.

## src/parsing.js

This contains the implementation for text parsing process. There is a tokenisation step followed by checking the syntax tree defined by the extracted tokens.
