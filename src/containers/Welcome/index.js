import React from 'react';
import { useMantineTheme } from '@mantine/core';
import { Link } from 'react-router-dom';
import { Container, Title, Group, SimpleGrid, Text } from '@mantine/core';
import styles from './index.module.scss';

import { IconKey, IconPassword, IconCloudLock } from '@tabler/icons-react';

const Welcome = () => {
    const theme = useMantineTheme();

    return (
        <Container className={styles.container}>
            <div className={styles.title}>
                <Title>WebCrypto</Title>
                <Text style={{ opacity: '0.5' }}>
                    Узнайте о том, как работает криптография в вебе
                </Text>
            </div>
            <Group>
                <SimpleGrid cols={2} mt="md">
                    <Link to="/symmetric" className={styles.item}>
                        <IconKey color={theme.colors['red'][6]} size="2rem" />
                        <Text size="sm" mt={7}>
                            Симметричное шифрование
                        </Text>
                    </Link>
                    <Link to="/asymmetric" className={styles.item}>
                        <div>
                            <IconKey color={theme.colors['orange'][6]} size="2rem" />
                            <IconKey color={theme.colors['yellow'][6]} size="2rem" />
                        </div>
                        <Text size="sm" mt={7}>
                            Асимметричное шифрование
                        </Text>
                    </Link>
                    <Link to="/hash" className={styles.item}>
                        <IconPassword color={theme.colors['green'][6]} size="2rem" />
                        <Text size="sm" mt={7}>
                            Хеширование
                        </Text>
                    </Link>
                    <Link to="/key-sharing" className={styles.item}>
                        <IconCloudLock color={theme.colors['blue'][6]} size="2rem" />
                        <Text size="sm" mt={7}>
                            Обмен ключами
                        </Text>
                    </Link>
                </SimpleGrid>
            </Group>
            <Group>
                <div className={styles.credits}>
                    Разработано <Link to="https://t.me/hit2hat" target="_blank">@hit2hat</Link> с ❤️ и ☕️
                </div>
            </Group>
        </Container>
    );
};

export default Welcome;
