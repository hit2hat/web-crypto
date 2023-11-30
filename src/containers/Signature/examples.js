export const JS_EXAMPLE = `class SignatureCrypto {
    algorithm = 'ECDSA';
    keyCurve = 'P-256';
    hashAlgorithm = 'SHA-256';

    /**
     * Генерация пары ключей для подписи: открытый и закрытый
     *
     * @return {Promise<CryptoKeyPair>}
     */
    async generateKeys() {
        return window.crypto.subtle.generateKey(
            {
                name: this.algorithm,
                namedCurve: this.keyCurve,
            },
            false,
            [ 'sign', 'verify' ],
        );
    }

    /**
     * Вычисление подписи
     *
     * @param {CryptoKey} key - закрытый ключ
     * @param {string} text - текст
     * @return {Promise<string | null>}
     */
    async sign(key, text) {
        return window.crypto.subtle.sign({
            name: this.algorithm,
            hash: {
                name: this.hashAlgorithm,
            },
        }, key, this.asciiToUint8Array(text))
            .then((bytes) => this.toHexString(bytes));
    }

    /**
     * Проверка подписи
     *
     * @param {CryptoKey} key - открытый ключ
     * @param {string} text - текст
     * @param {string} signature - подпись
     * @return {Promise<boolean>}
     */
    async verify(key, text, signature) {
        return window.crypto.subtle.verify({
            name: this.algorithm,
            hash: {
                name: this.hashAlgorithm,
            },
        }, key, this.hexStringToUint8Array(signature), this.asciiToUint8Array(text));
    }

    /**
     * Конвертация строки с текстом в массив байтов
     *
     * @param {string} text — текст
     * @return {Uint8Array}
     */
    asciiToUint8Array(text = '') {
        let chars = [];
        for (let i = 0; i < text.length; ++i) {
            chars.push(text.charCodeAt(i));
        }

        return new Uint8Array(chars);
    }

    /**
     * Конвертация строки с зашифрованным текстом в массив байтов
     *
     * @param {string} text — текст
     * @return {Uint8Array}
     */
    hexStringToUint8Array(text = '') {
        if (text.length % 2 !== 0) {
            throw 'Invalid string (%2 !== 0)';
        }

        let arrayBuffer = new Uint8Array(text.length / 2);
        for (let i = 0; i < text.length; i += 2) {
            let byteValue = parseInt(text.substr(i, 2), 16);
            if (isNaN(byteValue)) {
                throw 'Invalid hexString';
            }
            arrayBuffer[i/2] = byteValue;
        }

        return arrayBuffer;
    }

    /**
     * Конвертация массива байтов с зашифрованным текстом в строку
     *
     * @param {ArrayBuffer} bytes — массив байтов с зашифрованным текстом
     * @return {Uint8Array}
     */
    toHexString(bytes)
    {
        if (!bytes) return null;

        bytes = new Uint8Array(bytes);
        let hexBytes = [];

        for (let i = 0; i < bytes.length; ++i) {
            let byteString = bytes[i].toString(16);
            if (byteString.length < 2) {
                byteString = '0' + byteString;
            }

            hexBytes.push(byteString);
        }

        return hexBytes.join('');
    }
}`;
