import React, { useState } from 'react';
import {Textarea, useMantineTheme} from '@mantine/core';
import { Text } from '@mantine/core';
import styles from './index.module.scss';

import { IconKey } from '@tabler/icons-react';

const Playground = ({ text, encryptionKey, children = null, keys = [], onKey, onTextChange }) => {
    const theme = useMantineTheme();
    const [ isDrugging, setIsDrugging ] = useState(false);

    const activeKey = encryptionKey !== null ? (
        keys.find((x) => x.id === encryptionKey) || null
    ) : null;

    const applyKey = (keyId) => {
        const key = keys.find((x) => x.id === keyId) || null;
        if (key !== null) {
            onKey(key);
        }
    };

    return (
        <div className={styles.playground}>
            <div
                className={styles.block}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => applyKey(e.dataTransfer.getData('key'))}
            >
                {children === null ? (
                    <>
                        <Text className={styles.blockTitle}>
                            {activeKey !== null ? (
                                <>🔐 Зашифрованный текст • {activeKey.name}</>
                            ) : (
                                <>🔓 Обычный текст</>
                            )}
                        </Text>
                        <Textarea
                            disabled={isDrugging}
                            className={styles.blockText}
                            value={text}
                            onChange={(e) => onTextChange(e.currentTarget.value)}
                        />
                    </>
                ) : children}
            </div>
            {keys.map((key) => (
                <div
                    draggable
                    key={key.id}
                    className={styles.button}
                    onClick={() => applyKey(key.id)}
                    onDragEnd={() => setIsDrugging(false)}
                    onDragStart={(e) => {
                        e.dataTransfer.setData('key', key.id);
                        setIsDrugging(true);
                    }}
                >
                    {!key.icon ? (
                        <IconKey color={theme.colors[key.color][6]} size="38px" />
                    ) : key.icon}
                    <Text style={{ textAlign: 'center', fontSize: 12, lineHeight: 1.1 }}>{key.name}</Text>
                </div>
            ))}
        </div>
    );
};

export default Playground;
