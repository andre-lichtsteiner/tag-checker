import { parseAndCheckText } from "./parsing.js"

/**
 * @param {ParseResult} parseResult 
 */
export function formatOutputOfParseResult (parseResult) {
    if (parseResult.parsedSuccessfully) {
        return 'Correctly tagged paragraph'
    }
    const parseIssue = parseResult.parseIssue
    const expectedTagName = parseIssue.expectedTagName
    const foundTagName = parseIssue.foundTagName
    if (expectedTagName && foundTagName) {
        return `Expected </${expectedTagName}> found </${foundTagName}>`
    } else if (expectedTagName) {
        return `Expected </${expectedTagName}> found #`
    } else {
        return `Expected # found </${foundTagName}>`
    }
}

function main () {
    // An example of usage of the functions created
    const text = `
    <H>Hello 
        <B>World</B>
    </H>
    `

    const parseResult = parseAndCheckText(text)
    const output = formatOutputOfParseResult(parseResult)
    console.log('Output for example text: '+ output)
}

main()
