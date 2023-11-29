class DiffieHellmanCrypto {
    algorithm = 'ECDH';
    keyCurve = 'P-256';
    derivationBits = 64;

    /**
     * Генерация пары ключей для шифрования: открытый и закрытый
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
            [ 'deriveKey', 'deriveBits' ],
        );
    }

    /**
     * Вычисление общего секрета
     *
     * @param {CryptoKey} publicKey - открытый ключ
     * @param {CryptoKey} privateKey - закрытый ключ
     * @return {Promise<string | null>}
     */
    async derive(publicKey, privateKey) {
        return window.crypto.subtle.deriveBits({
            name: this.algorithm,
            namedCurve: this.keyCurve,
            public: publicKey,
        }, privateKey, this.derivationBits)
            .then((bytes) => this.toHexString(bytes));
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
}

export default new DiffieHellmanCrypto();
