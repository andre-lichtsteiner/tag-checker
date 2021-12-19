/**
 * @param {string} text
 */
export function parseAndCheckText(text) {
    // Form a tree etc
}

/**
 * Splits a given text string into tokens (Token[])
 * @param {string} text
 */
export function tokenise(text) {
    const startTagRegex = /<[A-Z]>/g
    const endTagRegex = /<\/[A-Z]>/g

    const tokens = []
    const textTokenMembershipBitmap = new Array(text.length).fill(0)


    const startTagMatches = [...text.matchAll(startTagRegex)]
    const endTagMatches = [...text.matchAll(endTagRegex)]

    for (const tagMatch of startTagMatches) {
        const tagName = tagMatch[0].slice(1, -1)
        const matchLength = tagMatch[0].length
        const token = new TagToken(text, tagMatch.index, matchLength, tagName, true)
        tokens.push(token)
        // Mark these characters as being members of a token (currently just overwriting)
        textTokenMembershipBitmap.splice(tagMatch.index, matchLength, ...Array(matchLength).fill(1))
    }
    for (const tagMatch of endTagMatches) {
        const tagName = tagMatch[0].slice(2, -1)
        const matchLength = tagMatch[0].length
        const token = new TagToken(text, tagMatch.index, matchLength, tagName, false)
        tokens.push(token)
        // Mark these characters as being members of a token (currently just overwriting)
        textTokenMembershipBitmap.splice(tagMatch.index, matchLength, ...Array(matchLength).fill(1))
    }

    let textToken = null
    textTokenMembershipBitmap.push(1) // To end any text token at the end of the string 
    textTokenMembershipBitmap.forEach((bitmapValue, i) => {
        if (!bitmapValue) {
            if (textToken) {
                // Extend the length of the existing text token
                textToken.length++
            } else {
                // Start a new text token from this position
                textToken = new Token(text, i, 1)
            }
        } else {
            if (textToken) {
                // End the existing text token, as it was before reaching this index
                tokens.push(textToken)
                textToken = null
            }
        }
    })
    
    tokens.sort((a, b) => a.position - b.position)

    console.log(tokens)
    return tokens
}

function findMatches (text, regex) {
    return [...text.matchAll(regex)]
}

class Token {
    constructor (text, position, length) {
        this.text = text
        this.position = position
        this.length = length
    }
}

class TagToken extends Token {
    constructor (text, position, length, tagName, isOpening) {
        super(text, position, length)
        this.tagName = tagName
        this.isOpening = isOpening ?? false
    }
}

class ParseIssue {
    constructor (expectedTag, foundTag) {
        this.expectedTag = expectedTag
        this.foundTag = foundTag
    }
}

export class ParseResult {
    constructor (parseIssue) {
        if (!parseIssue) {
            this.parsedSuccessfully = true
        } else {
            this.parseIssue = parseIssue
            this.parsedSuccessfully = false
        }
    }
}
