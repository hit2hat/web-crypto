import React from 'react';
import { Link } from 'react-router-dom';
import { Title, Text, Button } from '@mantine/core';
import styles from './index.module.scss';

import { IconChevronLeft } from '@tabler/icons-react';

const PageHeader = ({ icon, title, children }) => {
    return (
        <div>
            <div className={styles.back}>
                <Link to="/">
                    <Button
                        variant="light"
                        leftSection={<IconChevronLeft size={14} />}
                    >
                        Назад
                    </Button>
                </Link>
            </div>
            <div className={styles.header}>
                <div className={styles.icon}>
                    {icon}
                </div>
                <div className={styles.info}>
                    <Title order={2}>{title}</Title>
                    <Text className={styles.text}>{children}</Text>
                </div>
            </div>
        </div>
    );
};

export default PageHeader;
