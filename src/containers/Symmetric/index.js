import SymmetricCrypto from './crypto';
import * as Examples from './examples';
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
        color: 'red',
    },
    {
        id: 'key2',
        name: 'Ключ 2',
        color: 'blue',
    },
];

const Symmetric = () => {
    const theme = useMantineTheme();
    const [ keys, setKeys ] = useState(null);
    const [ text, setText ] = useState('Ваш секретный текст');
    const [ isLocked, setIsLocked ] = useState(false);
    const [ encryptionKey, setEncryptionKey ] = useState(null);

    useEffect(() => {
        const load = async () => {
            let keys = [];
            for (let x of KEYS) {
                keys.push({
                    ...x,
                    data: {
                        iv: SymmetricCrypto.generateIv(),
                        key: await SymmetricCrypto.generateKey(),
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
                icon={<IconKey color={theme.colors['red'][6]} size="81px" />}
                title="Симметричное шифрование"
            >
                Симметричное шифрование — это метод шифрования данных, при котором отправитель и получатель используют
                одинаковый секретный ключ для шифрования и расшифрования сообщений.
            </PageHeader>
            <Title order={2}>Как работает?</Title>
            <Text>
                Симметричное шифрование — это метод шифрования данных, при котором отправитель и получатель используют одинаковый
                секретный ключ для зашифрования и расшифрования сообщений. Оно обеспечивает конфиденциальность и целостность данных,
                так как шифрование и дешифрование происходят синхронно, то есть в одинаковые моменты времени.
                Это позволяет обеим сторонам безопасно обмениваться информацией, зная, что только они смогут прочитать
                содержимое сообщений.
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
                            if (encryptionKey !== key.id) {
                                return notifications.show({
                                    color: 'red',
                                    title: 'Неверный ключ!',
                                    message: 'Вы можете с расшировать текст ТОЛЬКО с помощью ключа, которым его зашифровали',
                                });
                            }

                            setIsLocked(false);
                            setEncryptionKey(null);
                            setText(decodeURIComponent(await SymmetricCrypto.decrypt(key.data.key, key.data.iv, text)));
                            return;
                        }

                        setIsLocked(true);
                        setEncryptionKey(key.id);
                        setText(await SymmetricCrypto.encrypt(key.data.key, key.data.iv, encodeURIComponent(text)));
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

export default Symmetric;
