export const JS_EXAMPLE = `class SymmetricCrypto {
    algorithm = 'AES-CBC';
    keyLength = 256;

    /**
     * Генерация верктора инициализации
     *
     * @return {Uint8Array}
     */
    generateIv() {
        return window.crypto.getRandomValues(new Uint8Array(16));
    }

    /**
     * Генерация ключа для шифрования
     *
     * @return {Promise<CryptoKey>}
     */
    async generateKey() {
        return window.crypto.subtle.generateKey(
            {
                name: this.algorithm,
                length: this.keyLength,
            },
            false,
            [ 'encrypt', 'decrypt' ],
        );
    }

    /**
     * Шифрование текста
     *
     * @param {CryptoKey} key - ключ
     * @param {Uint8Array} iv - вектор инициализации
     * @param {string} text — текст
     * @return {Promise<string | null>}
     */
    async encrypt(key, iv, text) {
        return window.crypto.subtle.encrypt({
            name: this.algorithm,
            iv,
        }, key, this.asciiToUint8Array(text))
            .then((bytes) => this.toHexString(bytes));
    }

    /**
     * Расшфрование текста
     *
     * @param {CryptoKey} key - ключ
     * @param {Uint8Array} iv - вектор инициализации
     * @param {string} text — зашифрованный текст
     * @return {Promise<string>}
     */
    async decrypt(key, iv, text) {
        return window.crypto.subtle.decrypt({
            name: this.algorithm,
            iv,
        }, key, this.hexStringToUint8Array(text))
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
