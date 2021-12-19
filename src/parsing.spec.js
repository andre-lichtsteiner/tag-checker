import { tokenise, parseAndCheckText } from './parsing'

test('correctly tokenises text with no tags', () => {
    const text = 'This is an example with no tags at all'
    const tokens = tokenise(text)
    expect(tokens).toHaveLength(1)
    expect(tokens?.[0]?.position).toEqual(0)
    expect(tokens?.[0]).toHaveLength(text.length)
})

test('correctly tokenises text with no tags but with < and >', () => {
    const text = 'This is an example with no tags where 1 < 3 and 4 > 3'
    const tokens = tokenise(text)
    expect(tokens).toHaveLength(1)
    expect(tokens?.[0]?.position).toEqual(0)
    expect(tokens?.[0]).toHaveLength(text.length)
})

test('correctly tokenises text with "tags" that are not single capital letters', () => {
    const text = 'This is an example with things that are like <a> <tag> but not to our specifications'
    const tokens = tokenise(text)
    expect(tokens).toHaveLength(1)
    expect(tokens?.[0]?.position).toEqual(0)
    expect(tokens?.[0]).toHaveLength(text.length)
})

test('correctly tokenises text with one tag surrounding the whole text', () => {
    const text = '<C>This is an example with no tags where 1 < 3 and 4 > 3</C>'
    const tokens = tokenise(text)
    expect(tokens).toHaveLength(3)
    expect(tokens?.[0]).toMatchObject({
        position: 0,
        length: 3,
        tagName: 'C',
        isOpening: true
    })
    expect(tokens?.[1]).toMatchObject({
        position: 3,
        length: 53
    })
    expect(tokens?.[2]).toMatchObject({
        position: 56,
        length: 4,
        tagName: 'C',
        isOpening: false
    })
})

test('correctly tokenises text with one tag inside the text', () => {
    const text = 'This is an <B>example</B> with a tag'
    const tokens = tokenise(text)
    expect(tokens).toHaveLength(5)

    expect(tokens?.[0]).toMatchObject({
        position: 0,
        length: 11
    })
    expect(tokens?.[1]).toMatchObject({
        position: 11,
        length: 3,
        tagName: 'B',
        isOpening: true
    })
    expect(tokens?.[2]).toMatchObject({
        position: 14,
        length: 7
    })
    expect(tokens?.[3]).toMatchObject({
        position: 21,
        length: 4,
        tagName: 'B',
        isOpening: false
    })
    expect(tokens?.[4]).toMatchObject({
        position: 25,
        length: 11
    })
})

test('correctly checks some valid texts', () => {
    const text1 = 'The following text<C><B>is centred and in boldface</B></C>'
    const text2 = '<B>This <\\g>is <B>boldface</B> in <<*> a</B> <\\6> <<d>sentence'
    
    expect(parseAndCheckText(text1).parsedSuccessfully).toBe(true)
    expect(parseAndCheckText(text2).parsedSuccessfully).toBe(true)
})

test('correctly checks some texts that are invalid', () => {
    const text1 = '<B><C> This should be centred and in boldface, but the tags are wrongly nested </B></C>'
    const text2 = '<B>This should be in boldface, but there is an extra closing tag</B></C>'
    const text3 = '<B><C>This should be centred and in boldface, but there is a missing closing tag</C>'
    expect(parseAndCheckText(text1).parsedSuccessfully).toBe(false)
    expect(parseAndCheckText(text2).parsedSuccessfully).toBe(false)
    expect(parseAndCheckText(text3).parsedSuccessfully).toBe(false)
})
