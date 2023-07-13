import { ErrorMessage } from '@immotech-component/data-view/src/error-message';
import { Text } from '@immotech-component/text';
import { ToDoListResponse, useToDos } from '@immotech-feature/todo-api';
import { Spacer } from 'native-x-spacer';
import { Stack } from 'native-x-stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { COLOR_X } from '../../theme/src/theme';
import { styles } from "@immotech-component/horizontal-lists-styles";

interface Props {

    showFullList?: () => void;
    onSelect?: (id: string, title?: string) => void;
}


export function ToDosHorizontalListView({ showFullList, onSelect }: Props) {
    const { data: todos, isLoading: loading, error } = useToDos();

    const statusColors: {
        [key: string]: {
            backgroundColor: string;
            fontColor: string;
            titleBackgroundColor: string;
        }
    } = {
        in_progress: {
            backgroundColor: 'rgba(255, 255, 255, 1)', // Mat yellow
            fontColor: '#000',
            titleBackgroundColor: 'rgba(255, 255, 0, 0.2)',
        },
        done: {
            backgroundColor: 'rgba(255, 255, 255, 1)', // Mat green
            fontColor: '#000',
            titleBackgroundColor: 'rgba(0, 255, 0, 0.2)',
        },
        open: {
            backgroundColor: 'rgba(255, 255, 255, 1)', // Mat red
            fontColor: '#000',
            titleBackgroundColor: 'rgba(255, 0, 0, 0.2)',
        },
    };

    const { t } = useTranslation();

    return (
        <Stack paddingRight={16}>
            <Stack style={[styles.header, { justifyContent: "flex-end" }] as any}>
                <TouchableOpacity style={styles.seeAllButton} onPress={() => showFullList!()}>
                    <Text style={styles.seeAllText} textColor={COLOR_X.OMNY_PURPLE}>{t("main.see_all")}</Text>
                </TouchableOpacity>
            </Stack>
            <Spinner visible={loading} />
            <FlatList
                data={todos}
                // keyExtractor={(entity) => entity.nid}
                keyExtractor={(maintenance) => maintenance.nid! + maintenance.title}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.item,
                            {
                                backgroundColor:
                                    statusColors[item.status]?.backgroundColor || styles.item.backgroundColor,
                            },
                        ]}
                        onPress={() => {
                            onSelect && onSelect(item.nid, item.assigned_entity_title);
                        }}
                    >

                        {/* {!!item.image &&
                            (<Stack style={styles.itemImageContainer}><Image source={{ uri: `https://immotech.cloud/system/files/${item.image}` }} style={styles.itemImage} /></Stack>)} */}
                        <Stack style={styles.itemDetails}>
                            <Stack style={[styles.titleBackground, { backgroundColor: statusColors[item.status]?.titleBackgroundColor }] as any} alignCenter alignMiddle>
                                <Text
                                    style={[
                                        styles.todoItemTitle,
                                        {
                                            color:
                                                statusColors[item.status]?.fontColor || styles?.itemTitle?.color,
                                        },
                                    ]}
                                    alignCenter
                                    bold
                                >
                                    {item.title}
                                </Text>
                            </Stack>


                            {item.cost && (
                                <Text
                                    style={[
                                        styles.itemDescription,

                                    ]}
                                >
                                    Cost: {item.cost} €
                                </Text>
                            )}
                            {item.priority && (
                                <Text
                                    style={[
                                        styles.itemDescription,

                                    ]}
                                >
                                    {t("todo.list.urgency")}:{" "}
                                    {item.priority == "middle"
                                        ? `${t("todo.list.urgency_types.middle")}`
                                        : item.priority == "short"
                                            ? `${t("todo.list.urgency_types.short")}`
                                            : item.priority == "long"
                                                ? `${t("todo.list.urgency_types.long")}`
                                                : `${t("todo.list.urgency_types.no_urgency")}`}
                                </Text>
                            )}
                            {item.status && (
                                <Text
                                    style={[
                                        styles.itemDescription,

                                    ]}
                                >
                                    Status: {item.status === 'in_progress' ? t("todo.list.status.in_progress") : item.status === 'done' ? t("todo.list.status.done") : item.status === 'open' ? t("todo.list.status.open") : "Status is undefined"}
                                </Text>
                            )}
                            <Text
                                style={[
                                    styles.itemDescription,

                                ]}
                            >
                                {t(`main.${item.assigned_entity_type}`)}: {item.assigned_entity_title}
                            </Text>

                            {item.created && (
                                <Text
                                    style={[
                                        styles.itemDescription,

                                    ]}
                                >
                                    {`${t("main.created")}: ${new Date(
                                        +item.created * 1000
                                    ).toLocaleString("en-GB", {
                                        timeZone: "UTC",
                                    })}`}
                                </Text>
                            )}

                            <Spacer size="normal" />

                        </Stack>
                    </TouchableOpacity>
                )}
            />
            {/* {error && (<><Spacer size="normal" /> <ErrorMessage>{error}</ErrorMessage></>)} */}
        </Stack>
    );
}

