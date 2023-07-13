import { DataView } from "@immotech-component/data-view";
import { Text } from "@immotech-component/text";
import { COLOR_X } from "@immotech-feature/theme";
import { ToDoResponse } from "@immotech-feature/todo-api";
import { useNetInfo } from "@react-native-community/netinfo";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import { Tappable } from "native-x-tappable";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { ToDoOpenImageView } from "./todo-open-image-view";

interface Props {
  todo?: ToDoResponse;
  loading?: boolean;
  error?: Error | null;
  parentTitle?: string;
  onStatusChanged?: (status: any) => any;
}

export type StatusType = {
  open: "Status: Open 🔴";
  in_progress: "Status: In Process 🟡";
  done: "Status: Completed 🟢";
};

export function ToDoDetailsViewComponent({
  todo,
  loading,
  error,
  parentTitle,
  onStatusChanged,
}: Props) {

  if (!todo) {
    return null;
  }

  const netInfo = useNetInfo();
  const { t } = useTranslation();

  const InfoText = ({ label, value }: { label: string; value?: string }) => (
    <Stack >
      <Text style={styles.infoLabel} textColor={COLOR_X.ACCENT2} fontSize="small">
        {label}:
      </Text>
      <Text textColor={COLOR_X.ACCENT3} fontSize="normal">{value}</Text>
    </Stack>
  );

  let statuses = {
    open: `${t("todo.list.status.open")} 🟥`,
    in_progress: `${t("todo.list.status.in_progress")} 🟨`,
    done: `${t("todo.list.status.done")} 🟩`,
  };

  const [status, setStatus] = useState<string | undefined>(todo?.field_todo_status?.und?.[0]?.value);
  const onStatusChange = (
    item: "open" | "in_progress" | "done" | undefined
  ) => {
    setStatus(item ? statuses[item] : "Status is undefined");
    onStatusChanged!({
      field_todo_status: {
        und: [item],
      },
    });
  };

  useEffect(() => {
    setStatus(
      !Array.isArray(todo?.field_todo_status)
        ? statuses[
        todo?.field_todo_status?.und![0].value as
        | "open"
        | "in_progress"
        | "done"
        ]
        : undefined
    );
  }, [todo]);

  const [showImage, setShowImage] = useState(false);

  const statusChange = useMemo(() => {
    return Object.entries(statuses ?? {}).map((value: any) => {
      setStatus(value[1]);
      return {
        label: value[1],
        value: value[0],
      };
    });
  }, [setStatus]);

  // TODO: make status changeable

  return (
    <DataView data={todo} isLoading={loading}>
      <Stack padding={["horizontal:normal", "vertical:small"]}>
        <Stack fillHorizontal horizontal justifyBetween>
          <Stack alignLeft maxWidth={"50%" as any}>
            <InfoText
              label={t("todo.details.object_usage_unit")}
              value={parentTitle!}
            />
            <Spacer size="small"></Spacer>
            {!Array.isArray(todo?.field_todo_description)
              ? <InfoText label={t("todo.details.description")} value={todo?.field_todo_description?.und?.[0]?.value} />
              : <Text textColor={COLOR_X.ACCENT3} fontSize="normal">{t("todo.list.no_short_desc")}</Text>
            }

            <Spacer size="small"></Spacer>
            {!Array.isArray(todo?.field_todo_priority)
              ? <InfoText label={t("todo.list.urgency")} value={`${t(`todo.list.urgency_types.${todo?.field_todo_priority!.und![0].value}`)}`} /> : <Text textColor={COLOR_X.ACCENT3} fontSize="normal">{t("todo.list.no_short_desc")}</Text>}


            <Spacer size="small"></Spacer>
            <InfoText
              label={"Status"}
              value={status}
            />

          </Stack>
          {!Array.isArray(todo?.field_todo_pictures) && (
            <Stack alignRight>
              <Tappable onTap={() => setShowImage(true)}>
                <Image
                  source={{
                    uri: (netInfo.isConnected && typeof todo?.field_todo_pictures !== 'string') ? `https://immotech.cloud/system/files/${todo?.field_todo_pictures.und[0].filename
                      }` : `data:image/png;base64,${todo?.field_todo_pictures}`
                  }}
                  style={{ width: 125, height: 125, borderRadius: 10 }}
                />
              </Tappable>
            </Stack>

          )}
        </Stack>
      </Stack>


      <Stack style={styles.container}>
        <Stack style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>{`${t('todo.details.select_status')}`}</Text>
          <RNPickerSelect
            placeholder={{
              label: todo?.field_todo_status?.und?.[0]?.value ? `${t(`todo.list.status.${todo?.field_todo_status?.und?.[0]?.value}`)}` : `${t('todo.details.select_status')}`,
              value: null
            }}
            items={statusChange}
            onValueChange={onStatusChange}
            style={{ inputIOS: styles.picker, inputAndroid: styles.picker }}
          />
        </Stack>
      </Stack>

      <Stack alignCenter>
        <Stack
          padding={["vertical:normal", "horizontal:normal"]}
          style={{ paddingRight: 30 }}
          alignCenter
        >
          {!Array.isArray(todo?.field_todo_short_desc) ? (
            <Stack>
              <Text fontSize="normal" alignCenter textColor={COLOR_X.ACCENT3}>
                Titel
              </Text>
              <Spacer size="x-small"></Spacer>
              <Text alignCenter textColor={COLOR_X.ACCENT3}>
                {todo?.field_todo_short_desc?.und?.[0].value}
              </Text>
            </Stack>
          ) : (
            <Text fontSize="normal" alignCenter textColor={COLOR_X.ACCENT3}>
              {t("todo.details.no_description")}
            </Text>
          )}

          <Spacer size="normal"></Spacer>

          {!Array.isArray(todo?.field_todo_note) ? (
            <Stack>
              <Text fontSize="normal" alignCenter textColor={COLOR_X.ACCENT3}>
                {t("todo.details.note")}
              </Text>
              <Spacer size="x-small"></Spacer>
              <Text alignCenter textColor={COLOR_X.ACCENT3}>
                {todo?.field_todo_note.und![0].value}
              </Text>
            </Stack>
          ) : (
            <Text fontSize="normal" alignCenter textColor={COLOR_X.ACCENT3}>
              {t("todo.details.no_note")}
            </Text>
          )}
        </Stack>
      </Stack>

      <Spacer size="small"></Spacer>


      <ToDoOpenImageView
        show={showImage}
        onDismiss={() => setShowImage(false)}
        todo={todo}
        imgUrls={
          !Array.isArray(todo?.field_todo_pictures)
            ? todo?.field_todo_pictures.und!.map((item: any) => {
              return {
                url: `https://immotech.cloud/system/files/${item.uri.replace(
                  "private://",
                  ""
                )}`,
              };
            })
            : []
        }
      />

      <Spacer size="small"></Spacer>
    </DataView>
  );
}

const styles = StyleSheet.create({
  infoText: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  infoLabel: {
    fontWeight: "bold",
    marginRight: 8,
  },
  section: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 4,
    marginBottom: 16,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  pickerContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3a3a3a',
    marginBottom: 5,
  },
  picker: {
    height: 50,
    fontSize: 16,
  },
});

export const ToDoDetailsView = React.memo(ToDoDetailsViewComponent)
