import { useNavigation } from "@react-navigation/native";
import { useQueryClient, Query } from "@tanstack/react-query";
import { Stack } from "native-x-stack";
import React from "react";
import { SearchListComponent } from "../../../component/search-list/src/search-list-component";
import { Screens } from "../navigation/screens";


interface Props {
    query?: string;
    onItemPress: () => void;
}


export function SearchResultList({ query, onItemPress }: Props) {
    const queryClient = useQueryClient();
    const [filteredData, setFilteredData] = React.useState<any[]>([]);

    const { push } = useNavigation<any>();

    const handleItemPress = React.useCallback((item: any) => {
        if (!item) {
            return;
        }
        const { queryKey, nid: id, id: internalID, title, lat, lon, parent_id, type } = item;


        if (queryKey === 'entities') {
            push(Screens.EntityDetails, { id, internalID, title });
        } else if (queryKey === 'properties') {
            push(Screens.PropertyDetails, { id, internalID, object: "property", lat, lon, parentId: parent_id, title });
        } else if (queryKey === 'units') {
            push(Screens.UnitDetails, { id, internalID, lat, lon, title })
        } else if (queryKey === 'maintenances') {
            push(Screens.MaintenanceDetails, { id, internalMaintenanceID: internalID, title, type })
        } else if (queryKey === 'todos') {
            push(Screens.ToDoDetails, { id, title })
        }

        onItemPress();
    }, [push])

    const cache = queryClient.getQueryCache().findAll() as Query<unknown, unknown, any[]>[];

    // when query prop is changed, filter the data
    React.useEffect(() => {
        if (query) {
            const data = cache
                .map((queries) => {
                    if (
                        queries.queryKey[0] === "entities" ||
                        queries.queryKey[0] === "properties" ||
                        queries.queryKey[0] === "units" ||
                        queries.queryKey[0] === "maintenances" ||
                        queries.queryKey[0] === "todos"
                    ) {
                        const queryData = queries?.state?.data;

                        return (
                            queryData?.filter((item: any) => {
                                item.key = item.id + item.title;
                                item.queryKey = queries.queryKey[0];
                                return item.title.includes(query);
                            }) ?? []
                        );
                    }
                })
                .filter(Boolean);
            setFilteredData(data);
        } else {
            setFilteredData([]);
        }
    }, [query]);

    return (
        <Stack>
            <SearchListComponent data={filteredData.flat(1)} onItemPress={handleItemPress} />
        </Stack>
    )
}