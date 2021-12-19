import { TagToken, Token, ParseResult, ParseIssue } from './parsingObjectTypes.js'

/**
 * @param {string} text
 */
export function parseAndCheckText(text) {
    // Form a tree
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
    const tokenMembershipBitmap = new Array(text.length).fill(0) // This will be updated so that zeroes indicate the character is just text


    const startTagMatches = [...text.matchAll(startTagRegex)]
    const endTagMatches = [...text.matchAll(endTagRegex)]

    for (const tagMatch of startTagMatches) {
        const matchString = tagMatch[0]
        const tagName = matchString.slice(1, -1)
        const token = new TagToken(text, tagMatch.index, matchString.length, tagName, true)
        tokens.push(token)
        updateBitmapForToken(tokenMembershipBitmap, tagMatch)
    }
    for (const tagMatch of endTagMatches) {
        const matchString = tagMatch[0]
        const tagName = matchString.slice(2, -1)
        const token = new TagToken(text, tagMatch.index, matchString.length, tagName, false)
        tokens.push(token)
        updateBitmapForToken(tokenMembershipBitmap, tagMatch)
    }
    
    // Now extract the plain text token(s), if any
    let accumulatedTextToken = null
    tokenMembershipBitmap.push(1) // To end any text token at the end of the string 
    tokenMembershipBitmap.forEach((usedAlready, i) => {
        if (usedAlready && accumulatedTextToken) {
            // End the existing text token, as it was before reaching this index
            tokens.push(accumulatedTextToken)
            accumulatedTextToken = null
        } else if (!usedAlready) {
            if (accumulatedTextToken) {
                // Extend the length of the existing text token
                accumulatedTextToken.length++
            } else {
                // Start a new text token from this position
                accumulatedTextToken = new Token(text, i, 1)
            }
        }
    })
    
    tokens.sort((a, b) => a.position - b.position)
    return tokens
}

function updateBitmapForToken (tokenMembershipBitmap, tagMatch) {
    // Mark these characters as being members of a token (currently just overwriting)
    const matchLength = tagMatch[0].length
    tokenMembershipBitmap.splice(tagMatch.index, matchLength, ...Array(matchLength).fill(1))
}
