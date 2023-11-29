export const JS_EXAMPLE = `class HashCrypto {
    algorithm = 'SHA-256';

    /**
     * Вычисление хеша
     *
     * @param {string} text — текст
     * @return {Promise<string | null>}
     */
    async hash(text) {
        return window.crypto.subtle.digest({
            name: this.algorithm,
        }, this.asciiToUint8Array(text))
            .then((bytes) => this.toHexString(bytes));
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
     * Конвертация массива байтов с хешем в строку
     *
     * @param {ArrayBuffer} bytes — массив байтов с хешем
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
