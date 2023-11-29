export const JS_EXAMPLE = `class AsymmetricCrypto {
    algorithm = 'RSA-OAEP';
    keyLength = 1024;
    hashAlgorithm = 'SHA-256';

    /**
     * Генерация пары ключей для шифрования: открытый и закрытый
     *
     * @return {Promise<CryptoKeyPair>}
     */
    async generateKeys() {
        return window.crypto.subtle.generateKey(
            {
                name: this.algorithm,
                modulusLength: this.keyLength,
                publicExponent: new Uint8Array([ 0x01, 0x00, 0x01 ]),
                hash: {
                    name: this.hashAlgorithm,
                },
            },
            false,
            [ 'encrypt', 'decrypt' ],
        );
    }

    /**
     * Шифрование текста
     *
     * @param {CryptoKey} publicKey - открытый ключ
     * @param {string} text — текст
     * @return {Promise<string | null>}
     */
    async encrypt(publicKey, text) {
        return window.crypto.subtle.encrypt({
            name: this.algorithm,
        }, publicKey, this.asciiToUint8Array(text))
            .then((bytes) => this.toHexString(bytes));
    }

    /**
     * Расшфрование текста
     *
     * @param {CryptoKey} privateKey - закрытый ключ
     * @param {string} text — зашифрованный текст
     * @return {Promise<string>}
     */
    async decrypt(privateKey, text) {
        return window.crypto.subtle.decrypt({
            name: this.algorithm,
        }, privateKey, this.hexStringToUint8Array(text))
            .then((bytes) => this.toASCIIString(bytes));
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

    /**
     * Конвертация массива байтов с текстом в строку
     *
     * @param {ArrayBuffer} bytes — массив байтов с текстом
     * @return {string}
     */
    toASCIIString(bytes) {
        return String.fromCharCode.apply(null, new Uint8Array(bytes));
    }
}`;
