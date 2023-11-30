import * as Examples from './examples';
import DiffieHellmanCrypto from './crypto';
import { useState, useEffect } from 'react';
import { useMantineTheme } from '@mantine/core';
import { CodeHighlight } from '@mantine/code-highlight';
import { Container, Title, Text, Tabs } from '@mantine/core';
import { IconCloudLock, IconBrandJavascript } from '@tabler/icons-react';

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
    {
        id: 'key3',
        name: 'Ключ 3',
    },
];

const DiffieHellman = () => {
    const theme = useMantineTheme();
    const [ keys, setKeys ] = useState(null);
    const [ activePublicKey, setActivePublicKey ] = useState(null);
    const [ activePrivateKey, setActivePrivateKey ] = useState(null);
    const [ sharedSecret, setSharedSecret ] = useState(null);

    useEffect(() => {
        const load = async () => {
            let keys = [];
            for (let x of KEYS) {
                const keyPair = await DiffieHellmanCrypto.generateKeys();

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
        const derive = async (publicKey, privateKey) => {
            setSharedSecret(await DiffieHellmanCrypto.derive(publicKey, privateKey));
        };

        if (activePublicKey !==  null && activePrivateKey !== null) {
            if (activePublicKey.data.decryptionKey !== activePrivateKey.id) {
                derive(activePublicKey.data.key, activePrivateKey.data.key);
            } else {
                setSharedSecret('❌ Одинаковые ключи');
            }
        }
    }, [ activePublicKey, activePrivateKey ]);

    return (
        <Container>
            <PageHeader
                icon={<IconCloudLock color={theme.colors['blue'][6]} size="81px" />}
                title="Обмен ключами"
            >
                Обмен ключами — это семейство криптографических протоколов, позволяющих двум и более сторонам
                получить общий секретный ключ, используя незащищённый от прослушивания канал связи.
            </PageHeader>
            <Title order={2}>Как работает?</Title>
            <Text>
                Обмен ключами на основе протокола Диффи-Хеллмана позволяет реализовать создание общего секретного
                ключа двум и более сторонам, используя незащищённые от прослушивания канал связи.<br/><br/>

                Рассмотрим следующий пример, когда Алиса хочет создать общий ключ с Бобом:
                <ul style={{ marginTop: 0 }}>
                    <li>Алиса и Боб генерируют у себя пару ключей: <span style={{ color: 'blue' }}><b>открытый</b></span> и <span style={{ color: 'red' }}><b>закрытый</b></span></li>
                    <li>Алиса и Боб публикуют свой <span style={{ color: 'blue' }}><b>открытый ключ</b></span> в интернете</li>
                    <li>Алиса применяет алгоритм для <span style={{ color: 'blue' }}><b>открытого ключа Боба</b></span> и <span style={{ color: 'red' }}><b>своего закрытого ключа</b></span></li>
                    <li>Боб применяет алгоритм для <span style={{ color: 'blue' }}><b>открытого ключа Алисы</b></span> и <span style={{ color: 'red' }}><b>своего закрытого ключа</b></span></li>
                    <li>Алиса и Боб имеют общий секрет</li>
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
                        <div>🔓 Публичный ключ: {activePublicKey !== null ? activePublicKey.name : 'Не выбран'}</div>
                        <div>🔐 Приватный ключ: {activePrivateKey !== null ? activePrivateKey.name : 'Не выбран'}</div>
                        <br/>
                        <div>Общий секрет: {sharedSecret !== null ? sharedSecret : 'Нет'}</div>
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

export default DiffieHellman;
