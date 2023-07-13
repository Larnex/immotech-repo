import React from "react";
import {ArchiveIcon} from "native-x-icon";
import { COLOR_X } from "@immotech-feature/theme";
import {COLOR} from 'native-x-theme';
import {useLocalStore, action} from 'easy-peasy';
import { useEntities } from "@immotech-feature/entity-api";
import { Button } from "@immotech-component/button";

export const BackupButton = () => {

    return (
        <>
            <ArchiveIcon color={COLOR.TERTIARY}/>
        </>
    )
}