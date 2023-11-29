import * as Examples from './examples';
import AsymmetricCrypto from './crypto';
import { useState, useEffect } from 'react';
import { useMantineTheme } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { CodeHighlight } from '@mantine/code-highlight';
import { Container, Title, Text, Tabs } from '@mantine/core';
import { IconKey, IconBrandJavascript } from '@tabler/icons-react';

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

const Asymmetric = () => {
    const theme = useMantineTheme();
    const [ keys, setKeys ] = useState(null);
    const [ text, setText ] = useState('Ваш секретный текст');
    const [ isLocked, setIsLocked ] = useState(false);
    const [ encryptionKey, setEncryptionKey ] = useState(null);

    useEffect(() => {
        const load = async () => {
            let keys = [];
            for (let x of KEYS) {
                const keyPair = await AsymmetricCrypto.generateKeys();

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
    }, []);

    return (
        <Container>
            <PageHeader
                icon={
                    <>
                        <IconKey color={theme.colors['orange'][6]} size="81px" />
                        <IconKey color={theme.colors['yellow'][6]} size="81px" />
                    </>
                }
                title="Симметричное шифрование"
            >
                Асимметричное шифрование — это метод шифрования данных, при котором отправитель и получатель используют
                разные секретный ключи для шифрования и расшифрования сообщений.
            </PageHeader>
            <Title order={2}>Как работает?</Title>
            <Text>
                Асимметричное шифрование — это тип шифрования, в котором для шифрования и расшифровки данных используются
                два разных ключа: открытый ключ и закрытый ключ. Открытый ключ может быть передан любому, кто хочет
                отправить зашифрованное сообщение, а закрытый ключ хранится в секрете.<br/><br/>

                Рассмотрим следующий пример, когда Боб хочет отправить секретное сообщение Алисе:
                <ul style={{ marginTop: 0 }}>
                    <li>Алиса генерирует пару ключей: <span style={{ color: 'blue' }}><b>открытый</b></span> и <span style={{ color: 'red' }}><b>закрытый</b></span></li>
                    <li>Алиса публикует <span style={{ color: 'blue' }}><b>открытый ключ</b></span> в интернете</li>
                    <li>Боб зашифровывает сообщение с помощью <span style={{ color: 'blue' }}><b>открытого ключа</b></span> Алисы</li>
                    <li>Алиса получает зашифрованное сообщение</li>
                    <li>Алиса использует <span style={{ color: 'red' }}><b>закрытого ключа</b></span> для расшифровки сообщения</li>
                </ul>
            </Text>
            <Title order={2} style={{ marginTop: 12 }}>Попробовать</Title>
            {keys !== null && (
                <Playground
                    text={text}
                    encryptionKey={encryptionKey}
                    onTextChange={setText}
                    keys={keys}
                    onKey={async (key) => {
                        if (isLocked) {
                            if (key.id.endsWith('public')) {
                                return notifications.show({
                                    color: 'red',
                                    title: 'Неверный ключ!',
                                    message: 'Нельзя расшифровать текст с помощью открытого ключа. Он используется ТОЛЬКО для зашифровки.',
                                });
                            }

                            if (encryptionKey !== key.id) {
                                return notifications.show({
                                    color: 'red',
                                    title: 'Неверный ключ!',
                                    message: 'Вы можете с расшировать текст ТОЛЬКО с помощью ключа, которым его зашифровали',
                                });
                            }

                            setIsLocked(false);
                            setEncryptionKey(null);
                            setText(decodeURIComponent(await AsymmetricCrypto.decrypt(key.data.key, text)));
                            return;
                        }

                        if (!key.id.endsWith('public')) {
                            return notifications.show({
                                color: 'red',
                                title: 'Неверный ключ!',
                                message: 'Нельзя зашифровать текст с помощью закрытого ключа. Он используется ТОЛЬКО для расшифровки.',
                            });
                        }

                        setIsLocked(true);
                        setEncryptionKey(key.data.decryptionKey);
                        setText(await AsymmetricCrypto.encrypt(key.data.key, encodeURIComponent(text)));
                    }}
                />
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

export default Asymmetric;
