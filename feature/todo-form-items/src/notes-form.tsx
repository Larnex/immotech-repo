import { NoteFormItem } from '@immotech-feature/maintenance-form-items/src/note-form-item';
import { TitleNoteFormItem } from '@immotech-feature/maintenance-form-items/src/title-note-form-item';
import React, { useState } from 'react';
import { Spacer } from "native-x-spacer";
import { Button } from '@immotech-component/button';
import { useTranslation } from "react-i18next";
import { COLOR_X } from '@immotech-feature/theme';
import { Stack } from "native-x-stack";

interface Note {
    title?: string;
    text?: string;
    id?: string;
}

interface Props {
    notes: Note[] | [];
    addNote: () => void;
    removeNote: (index: number) => void;
    titleChange: (index: number, title: string) => void;
    textChange: (index: number, text: string) => void;
}

export function NotesForm({ addNote, removeNote, titleChange, textChange, notes }: Props) {
    const { t } = useTranslation();

    return (
        <>
            {notes.map((note, index) => (
                <React.Fragment key={index}>
                    <Spacer size="small"></Spacer>
                    <TitleNoteFormItem
                        value={note.title && note.title}
                        onTitleChange={(title) => titleChange(index, title)}
                    />
                    <Spacer size="small"></Spacer>
                    <NoteFormItem
                        value={note.text && note.text}
                        onTextChange={(text) => textChange(index, text)}
                    />
                    <Spacer size="small"></Spacer>
                    <Stack alignCenter>
                        <Button backgroundColor={COLOR_X.ACCENT7} height={50} maxWidth={200} onTap={() => removeNote(index)}>
                            {t("tga.delete_note")}
                        </Button>
                    </Stack>
                </React.Fragment>
            ))}
            <Spacer size="small"></Spacer>
            <Stack alignCenter>
                <Button backgroundColor={COLOR_X.ACCENT6} onTap={addNote} height={50} maxWidth={200}>{t("tga.add_note")}</Button>
            </Stack>
            <Spacer size="small"></Spacer>

        </>
    );
}