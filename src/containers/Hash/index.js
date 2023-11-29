import { useState } from 'react';
import HashCrypto from './crypto';
import * as Examples from './examples';
import { useMantineTheme } from '@mantine/core';
import { CodeHighlight } from '@mantine/code-highlight';
import { Container, Title, Text, Tabs } from '@mantine/core';
import { IconPassword, IconBrandJavascript } from '@tabler/icons-react';

import PageHeader from '../../components/PageHeader';
import Playground from '../../components/Playground';

const KEYS = [
    {
        id: 'key1',
        name: 'SHA 1',
        icon: <IconPassword color="#40c057" size="38px" />,
        data: {
            algorithm: 'SHA-1',
        },
    },
    {
        id: 'key2',
        name: 'SHA 256',
        icon: <IconPassword color="#40c057" size="38px" />,
        data: {
            algorithm: 'SHA-256',
        },
    },
    {
        id: 'key3',
        name: 'SHA 384',
        icon: <IconPassword color="#40c057" size="38px" />,
        data: {
            algorithm: 'SHA-384',
        },
    },
    {
        id: 'key4',
        name: 'SHA 512',
        icon: <IconPassword color="#40c057" size="38px" />,
        data: {
            algorithm: 'SHA-512',
        },
    },
];

const Hash = () => {
    const theme = useMantineTheme();
    const [ text, setText ] = useState('Ваш секретный текст');

    return (
        <Container>
            <PageHeader
                icon={<IconPassword color={theme.colors['green'][6]} size="81px" />}
                title="Хеширование"
            >
                Хеширование — это метод шифрования данных, при котором отправитель и получатель используют
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
            <Playground
                text={text}
                encryptionKey={null}
                onTextChange={setText}
                keys={KEYS}
                onKey={async (key) => {
                    setText(await HashCrypto.hash(key.data.algorithm, text));
                }}
            />
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

export default Hash;
