import * as Examples from './examples';
import SignatureCrypto from './crypto';
import { useState, useEffect } from 'react';
import { useMantineTheme } from '@mantine/core';
import { CodeHighlight } from '@mantine/code-highlight';
import { Container, Title, Text, Tabs, Textarea } from '@mantine/core';
import { IconCertificate, IconBrandJavascript } from '@tabler/icons-react';
import styles from './index.module.scss';

import PageHeader from '../../components/PageHeader';
import Playground from '../../components/Playground';

const KEYS = [
    {
        id: 'key1',
        name: 'Ключ 1',
    },
    {
        id: 'key2',
        name: 'Ключ 2',
    },
];

const Signature = () => {
    const theme = useMantineTheme();
    const [ keys, setKeys ] = useState(null);
    const [ text, setText ] = useState('abc');
    const [ activePublicKey, setActivePublicKey ] = useState(null);
    const [ activePrivateKey, setActivePrivateKey ] = useState(null);
    const [ isValid, setIsValid ] = useState(false);
    const [ signature, setSignature ] = useState('');

    useEffect(() => {
        const load = async () => {
            let keys = [];
            for (let x of KEYS) {
                const keyPair = await SignatureCrypto.generateKeys();

                keys.push({
                    ...x,
                    id: `${x.id}-public`,
                    name: `${x.name} (Открытый)`,
                    color: 'blue',
                    data: {
                        decryptionKey: x.id,
                        key: keyPair.publicKey,
                    },
                });

                keys.push({
                    ...x,
                    id: x.id,
                    name: `${x.name} (Закрытый)`,
                    color: 'red',
                    data: {
                        key: keyPair.privateKey,
                    },
                });
            }

            setKeys(keys);
        };

        if (keys === null) {
            load();
        }
    }, [ keys ]);

    useEffect(() => {
        const doAction = async (publicKey, privateKey) => {
            const signature = await SignatureCrypto.sign(privateKey, text);
            setSignature(signature);
            setIsValid(await SignatureCrypto.verify(publicKey, text, signature));
        };

        if (activePublicKey !==  null && activePrivateKey !== null) {
            doAction(activePublicKey.data.key, activePrivateKey.data.key);
        }
    }, [ text, activePublicKey, activePrivateKey ]);

    return (
        <Container>
            <PageHeader
                icon={<IconCertificate color={theme.colors['blue'][6]} size="81px" />}
                title="Цифровая подпись"
            >
                Цифровая подпись — это алгоритм, позволяющий создать электронную подпись
                на основе криптографии с закрытым ключом.
            </PageHeader>
            <Title order={2}>Как работает?</Title>
            <Text>
                Алгоритм цифровой подписи требуется в тех случаях, когда сторонам важно убедиться,
                что информация, которую они передали по незащищенным каналам связи не была изменена.

                Рассмотрим следующий пример, когда Алиса хочет подписать сообщение для Боба:
                <ul style={{ marginTop: 0 }}>
                    <li>Алиса генерирует у себя пару ключей: <span style={{ color: 'blue' }}><b>открытый</b></span> и <span style={{ color: 'red' }}><b>закрытый</b></span></li>
                    <li>Алиса публикуют свой <span style={{ color: 'blue' }}><b>открытый ключ</b></span> в интернете</li>
                    <li>Алиса вычисляет цифровую подпись для своего сообщения с помощью <span style={{ color: 'red' }}><b>закрытого ключа</b></span></li>
                    <li>Алиса передаёт своё сообщение Бобу</li>
                    <li>Боб проверяет цифровую подпись для сообщения Алисы с помощью её <span style={{ color: 'blue' }}><b>открытого ключа</b></span></li>
                    <li>Боб удостоверяется, что сообщение не было изменено</li>
                </ul>
            </Text>
            <Title order={2} style={{ marginTop: 12 }}>Попробовать</Title>
            {keys !== null && (
                <Playground
                    encryptionKey={null}
                    keys={keys}
                    onKey={async (key) => {
                        const type = key.id.endsWith('public') ? 'public' : 'private';
                        if (type === 'public') {
                            setActivePublicKey(key);
                        }

                        if (type === 'private') {
                            setActivePrivateKey(key);
                        }
                    }}
                >
                    <div>
                        <Text className={styles.blockTitle}>
                            Текст для подписи
                        </Text>
                        <Textarea
                            className={styles.blockText}
                            value={text}
                            onChange={(e) => setText(e.currentTarget.value)}
                        />
                        <div>🔓 Публичный ключ: {activePublicKey !== null ? activePublicKey.name : 'Не выбран'}</div>
                        <div>🔐 Приватный ключ: {activePrivateKey !== null ? activePrivateKey.name : 'Не выбран'}</div>
                        <br/>
                        <div>Подпись: {signature.length > 32 ? signature.slice(0, 16) + '...' + signature.slice(-16) : signature}</div>
                        <div>Проверка подписи: {isValid ? '✅' : '❌'}</div>
                    </div>
                </Playground>
            )}
            <Title order={2} style={{ marginTop: 12 }}>Пример кода</Title>
            <Tabs
                mt={12}
                pb={24}
                defaultValue="js"
                orientation="vertical"
            >
                <Tabs.List>
                    <Tabs.Tab
                        value="js"
                        leftSection={
                            <IconBrandJavascript
                                width={12}
                                height={12}
                            />
                        }
                    >
                        JavaScript
                    </Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="js">
                    <CodeHighlight
                        code={Examples.JS_EXAMPLE}
                        language="tsx"
                    />
                </Tabs.Panel>
            </Tabs>
        </Container>
    );
};

export default Signature;
