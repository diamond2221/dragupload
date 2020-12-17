
/* eslint-disable */
function md5(string: string) {
    function md5_RotateLeft(lValue: number, iShiftBits: number) {
        // tslint:disable-next-line: no-bitwise
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits))
    }
    function md5_AddUnsigned(lX: number, lY: number) {
        // tslint:disable-next-line: one-variable-per-declaration
        let lX4, lY4, lX8, lY8, lResult
        // tslint:disable-next-line: no-bitwise
        lX8 = lX & 0x80000000
        // tslint:disable-next-line: no-bitwise
        lY8 = lY & 0x80000000
        // tslint:disable-next-line: no-bitwise
        lX4 = lX & 0x40000000
        // tslint:disable-next-line: no-bitwise
        lY4 = lY & 0x40000000
        // tslint:disable-next-line: no-bitwise
        lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff)
        // tslint:disable-next-line: no-bitwise
        if (lX4 & lY4) {
            // tslint:disable-next-line: no-bitwise
            return lResult ^ 0x80000000 ^ lX8 ^ lY8
        }
        // tslint:disable-next-line: no-bitwise
        if (lX4 | lY4) {
            // tslint:disable-next-line: no-bitwise
            if (lResult & 0x40000000) {
                // tslint:disable-next-line: no-bitwise
                return lResult ^ 0xc0000000 ^ lX8 ^ lY8
            } else {
                // tslint:disable-next-line: no-bitwise
                return lResult ^ 0x40000000 ^ lX8 ^ lY8
            }
        } else {
            // tslint:disable-next-line: no-bitwise
            return lResult ^ lX8 ^ lY8
        }
    }
    function md5_F(x: number, y: number, z: number) {
        // tslint:disable-next-line: no-bitwise
        return (x & y) | (~x & z)
    }
    function md5_G(x: number, y: number, z: number) {
        // tslint:disable-next-line: no-bitwise
        return (x & z) | (y & ~z)
    }
    function md5_H(x: number, y: number, z: number) {
        // tslint:disable-next-line: no-bitwise
        return x ^ y ^ z
    }
    function md5_I(x: number, y: number, z: number) {
        // tslint:disable-next-line: no-bitwise
        return y ^ (x | ~z)
    }
    function md5_FF(
        a: number,
        b: number,
        c: number,
        d: number,
        x: any,
        s: number,
        ac: number
    ) {
        // tslint:disable-next-line: no-parameter-reassignment
        a = md5_AddUnsigned(
            a,
            md5_AddUnsigned(md5_AddUnsigned(md5_F(b, c, d), x), ac)
        )
        return md5_AddUnsigned(md5_RotateLeft(a, s), b)
    }
    function md5_GG(
        a: number,
        b: number,
        c: number,
        d: number,
        x: any,
        s: number,
        ac: number
    ) {
        // tslint:disable-next-line: no-parameter-reassignment
        a = md5_AddUnsigned(
            a,
            md5_AddUnsigned(md5_AddUnsigned(md5_G(b, c, d), x), ac)
        )
        return md5_AddUnsigned(md5_RotateLeft(a, s), b)
    }
    function md5_HH(
        a: number,
        b: number,
        c: number,
        d: number,
        x: any,
        s: number,
        ac: number
    ) {
        // tslint:disable-next-line: no-parameter-reassignment
        a = md5_AddUnsigned(
            a,
            md5_AddUnsigned(md5_AddUnsigned(md5_H(b, c, d), x), ac)
        )
        return md5_AddUnsigned(md5_RotateLeft(a, s), b)
    }
    function md5_II(
        a: number,
        b: number,
        c: number,
        d: number,
        x: any,
        s: number,
        ac: number
    ) {
        // tslint:disable-next-line: no-parameter-reassignment
        a = md5_AddUnsigned(
            a,
            md5_AddUnsigned(md5_AddUnsigned(md5_I(b, c, d), x), ac)
        )
        return md5_AddUnsigned(md5_RotateLeft(a, s), b)
    }
    function md5_ConvertToWordArray(string: string) {
        let lWordCount
        const lMessageLength = string.length
        const lNumberOfWords_temp1 = lMessageLength + 8
        const lNumberOfWords_temp2 =
            (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64
        const lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16
        const lWordArray = Array(lNumberOfWords - 1)
        let lBytePosition = 0
        let lByteCount = 0
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4
            lBytePosition = (lByteCount % 4) * 8
            lWordArray[lWordCount] =
                // tslint:disable-next-line: no-bitwise
                lWordArray[lWordCount] |
                // tslint:disable-next-line: no-bitwise
                (string.charCodeAt(lByteCount) << lBytePosition)
            lByteCount++
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4
        lBytePosition = (lByteCount % 4) * 8
        lWordArray[lWordCount] =
            // tslint:disable-next-line: no-bitwise
            lWordArray[lWordCount] | (0x80 << lBytePosition)
        // tslint:disable-next-line: no-bitwise
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3
        // tslint:disable-next-line: no-bitwise
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29
        return lWordArray
    }
    function md5_WordToHex(lValue: number) {
        // tslint:disable-next-line: one-variable-per-declaration
        let WordToHexValue = ''
        let WordToHexValue_temp = ''
        let lByte
        let lCount
        for (lCount = 0; lCount <= 3; lCount++) {
            // tslint:disable-next-line: no-bitwise
            lByte = (lValue >>> (lCount * 8)) & 255
            WordToHexValue_temp = '0' + lByte.toString(16)
            WordToHexValue =
                WordToHexValue +
                WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2)
        }
        return WordToHexValue
    }
    function md5_Utf8Encode(string: string) {
        // tslint:disable-next-line: no-parameter-reassignment
        string = string.replace(/\r\n/g, '\n')
        let utftext = ''
        for (let n = 0; n < string.length; n++) {
            const c = string.charCodeAt(n)
            if (c < 128) {
                utftext += String.fromCharCode(c)
            } else if (c > 127 && c < 2048) {
                // tslint:disable-next-line: no-bitwise
                utftext += String.fromCharCode((c >> 6) | 192)
                // tslint:disable-next-line: no-bitwise
                utftext += String.fromCharCode((c & 63) | 128)
            } else {
                // tslint:disable-next-line: no-bitwise
                utftext += String.fromCharCode((c >> 12) | 224)
                // tslint:disable-next-line: no-bitwise
                utftext += String.fromCharCode(((c >> 6) & 63) | 128)
                // tslint:disable-next-line: no-bitwise
                utftext += String.fromCharCode((c & 63) | 128)
            }
        }
        return utftext
    }
    let x = []
    // tslint:disable-next-line: one-variable-per-declaration
    let k, AA, BB, CC, DD, a, b, c, d
    // tslint:disable-next-line: one-variable-per-declaration
    const S11 = 7
    const S12 = 12
    const S13 = 17
    const S14 = 22
    // tslint:disable-next-line: one-variable-per-declaration
    const S21 = 5
    const S22 = 9
    const S23 = 14
    const S24 = 20
    // tslint:disable-next-line: one-variable-per-declaration
    const S31 = 4
    const S32 = 11
    const S33 = 16
    const S34 = 23
    // tslint:disable-next-line: one-variable-per-declaration
    const S41 = 6
    const S42 = 10
    const S43 = 15
    const S44 = 21
    // tslint:disable-next-line: no-parameter-reassignment
    string = md5_Utf8Encode(string)
    x = md5_ConvertToWordArray(string)
    a = 0x67452301
    b = 0xefcdab89
    c = 0x98badcfe
    d = 0x10325476
    for (k = 0; k < x.length; k += 16) {
        AA = a
        BB = b
        CC = c
        DD = d
        a = md5_FF(a, b, c, d, x[k + 0], S11, 0xd76aa478)
        d = md5_FF(d, a, b, c, x[k + 1], S12, 0xe8c7b756)
        c = md5_FF(c, d, a, b, x[k + 2], S13, 0x242070db)
        b = md5_FF(b, c, d, a, x[k + 3], S14, 0xc1bdceee)
        a = md5_FF(a, b, c, d, x[k + 4], S11, 0xf57c0faf)
        d = md5_FF(d, a, b, c, x[k + 5], S12, 0x4787c62a)
        c = md5_FF(c, d, a, b, x[k + 6], S13, 0xa8304613)
        b = md5_FF(b, c, d, a, x[k + 7], S14, 0xfd469501)
        a = md5_FF(a, b, c, d, x[k + 8], S11, 0x698098d8)
        d = md5_FF(d, a, b, c, x[k + 9], S12, 0x8b44f7af)
        c = md5_FF(c, d, a, b, x[k + 10], S13, 0xffff5bb1)
        b = md5_FF(b, c, d, a, x[k + 11], S14, 0x895cd7be)
        a = md5_FF(a, b, c, d, x[k + 12], S11, 0x6b901122)
        d = md5_FF(d, a, b, c, x[k + 13], S12, 0xfd987193)
        c = md5_FF(c, d, a, b, x[k + 14], S13, 0xa679438e)
        b = md5_FF(b, c, d, a, x[k + 15], S14, 0x49b40821)
        a = md5_GG(a, b, c, d, x[k + 1], S21, 0xf61e2562)
        d = md5_GG(d, a, b, c, x[k + 6], S22, 0xc040b340)
        c = md5_GG(c, d, a, b, x[k + 11], S23, 0x265e5a51)
        b = md5_GG(b, c, d, a, x[k + 0], S24, 0xe9b6c7aa)
        a = md5_GG(a, b, c, d, x[k + 5], S21, 0xd62f105d)
        d = md5_GG(d, a, b, c, x[k + 10], S22, 0x2441453)
        c = md5_GG(c, d, a, b, x[k + 15], S23, 0xd8a1e681)
        b = md5_GG(b, c, d, a, x[k + 4], S24, 0xe7d3fbc8)
        a = md5_GG(a, b, c, d, x[k + 9], S21, 0x21e1cde6)
        d = md5_GG(d, a, b, c, x[k + 14], S22, 0xc33707d6)
        c = md5_GG(c, d, a, b, x[k + 3], S23, 0xf4d50d87)
        b = md5_GG(b, c, d, a, x[k + 8], S24, 0x455a14ed)
        a = md5_GG(a, b, c, d, x[k + 13], S21, 0xa9e3e905)
        d = md5_GG(d, a, b, c, x[k + 2], S22, 0xfcefa3f8)
        c = md5_GG(c, d, a, b, x[k + 7], S23, 0x676f02d9)
        b = md5_GG(b, c, d, a, x[k + 12], S24, 0x8d2a4c8a)
        a = md5_HH(a, b, c, d, x[k + 5], S31, 0xfffa3942)
        d = md5_HH(d, a, b, c, x[k + 8], S32, 0x8771f681)
        c = md5_HH(c, d, a, b, x[k + 11], S33, 0x6d9d6122)
        b = md5_HH(b, c, d, a, x[k + 14], S34, 0xfde5380c)
        a = md5_HH(a, b, c, d, x[k + 1], S31, 0xa4beea44)
        d = md5_HH(d, a, b, c, x[k + 4], S32, 0x4bdecfa9)
        c = md5_HH(c, d, a, b, x[k + 7], S33, 0xf6bb4b60)
        b = md5_HH(b, c, d, a, x[k + 10], S34, 0xbebfbc70)
        a = md5_HH(a, b, c, d, x[k + 13], S31, 0x289b7ec6)
        d = md5_HH(d, a, b, c, x[k + 0], S32, 0xeaa127fa)
        c = md5_HH(c, d, a, b, x[k + 3], S33, 0xd4ef3085)
        b = md5_HH(b, c, d, a, x[k + 6], S34, 0x4881d05)
        a = md5_HH(a, b, c, d, x[k + 9], S31, 0xd9d4d039)
        d = md5_HH(d, a, b, c, x[k + 12], S32, 0xe6db99e5)
        c = md5_HH(c, d, a, b, x[k + 15], S33, 0x1fa27cf8)
        b = md5_HH(b, c, d, a, x[k + 2], S34, 0xc4ac5665)
        a = md5_II(a, b, c, d, x[k + 0], S41, 0xf4292244)
        d = md5_II(d, a, b, c, x[k + 7], S42, 0x432aff97)
        c = md5_II(c, d, a, b, x[k + 14], S43, 0xab9423a7)
        b = md5_II(b, c, d, a, x[k + 5], S44, 0xfc93a039)
        a = md5_II(a, b, c, d, x[k + 12], S41, 0x655b59c3)
        d = md5_II(d, a, b, c, x[k + 3], S42, 0x8f0ccc92)
        c = md5_II(c, d, a, b, x[k + 10], S43, 0xffeff47d)
        b = md5_II(b, c, d, a, x[k + 1], S44, 0x85845dd1)
        a = md5_II(a, b, c, d, x[k + 8], S41, 0x6fa87e4f)
        d = md5_II(d, a, b, c, x[k + 15], S42, 0xfe2ce6e0)
        c = md5_II(c, d, a, b, x[k + 6], S43, 0xa3014314)
        b = md5_II(b, c, d, a, x[k + 13], S44, 0x4e0811a1)
        a = md5_II(a, b, c, d, x[k + 4], S41, 0xf7537e82)
        d = md5_II(d, a, b, c, x[k + 11], S42, 0xbd3af235)
        c = md5_II(c, d, a, b, x[k + 2], S43, 0x2ad7d2bb)
        b = md5_II(b, c, d, a, x[k + 9], S44, 0xeb86d391)
        a = md5_AddUnsigned(a, AA)
        b = md5_AddUnsigned(b, BB)
        c = md5_AddUnsigned(c, CC)
        d = md5_AddUnsigned(d, DD)
    }
    return (
        md5_WordToHex(a) +
        md5_WordToHex(b) +
        md5_WordToHex(c) +
        md5_WordToHex(d)
    ).toLowerCase()
}
export default md5
