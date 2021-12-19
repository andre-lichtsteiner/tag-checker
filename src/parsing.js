/**
 * @param {string} text
 */
export function parseAndCheckText(text) {
    // Form a tree etc
    const tokens = tokenise(text)
    const nodeTree = {
        parent: null,
        child: null,
        token: null
    }
    let currentNode = nodeTree
    for (const token of tokens) {
        if (token.tagName && token.isOpening) {
            // Create and join a new node to the tree, and then set that to be where we are in the tree currently
            const newTag = {
                parent: currentNode,
                child: null,
                token
            }
            currentNode.child = newTag
            currentNode = newTag
        } else if (token.tagName && !token.isOpening && token.tagName !== currentNode?.token?.tagName) {
            // Problem: Improperly ending a tag that is not the most recently started one (including if no tag has been started yet)
            return new ParseResult(new ParseIssue(currentNode?.token?.tagName, token.tagName))
        } else if (token.tagName && !token.isOpening) {
            // Go up a node in the tree
            currentNode = currentNode.parent
        }
    }
    if (currentNode.parent) {
        // Problem: We haven't returned back to the root, so have not closed the current tag
        return new ParseResult(new ParseIssue(currentNode?.token?.tagName, null))
    }
    return new ParseResult()
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
    return tokens
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
    constructor (expectedTagName, foundTagName) {
        this.expectedTagName = expectedTagName
        this.foundTagName = foundTagName
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
