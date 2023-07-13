import { Button } from "@immotech-component/button";
import { ErrorPopup } from "@immotech-component/error-popup";
import { Form } from "@immotech-component/form";
import { EntityType } from "@immotech-feature/entity-api";
import { CityFormItem, IdFormItem, PostalCodeFormItem, TitleFormItem } from "@immotech-feature/entity-form-items";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import React from "react";
import { useTranslation } from "react-i18next";
import Spinner from "react-native-loading-spinner-overlay/lib";

export type AddEntityParams = Pick<
  EntityType,
  | "nid"
  | "title"
  | "field_account_entity_city"
  | "field_account_entity_id"
  | "field_account_entity_postalcode"
>;

interface Props {
  loading?: boolean;
  error?: Error | null;
  onSubmit?: (entity: AddEntityParams) => void;
  entityFormLoading?: boolean;
}

export function AddEntityForm({
  loading,
  error,
  onSubmit,
  entityFormLoading,
}: Props) {
  const { t } = useTranslation();

  const onFormSubmit = async ({
    state,
    isValid,
  }: {
    state: any;
    isValid: boolean;
  }) => {
    state = {
      title: state.title,
      field_account_entity_city: {
        und: [
          {
            value: state.city,
          },
        ],
      },

      field_account_entity_id: {
        und: [
          {
            value: state.nid,
          },
        ],
      },

      field_account_entity_postalcode: {
        und: [
          {
            value: state.postalcode,
          },
        ],
      },
    };

    if (isValid) {
      return onSubmit?.(state);
    }
  };

  const initialState = React.useMemo(
    () => ({
      title: "",
      nid: "",
      field_account_entity_city: {
        und: [
          {
            value: "",
          },
        ],
      },
      field_account_entity_id: {
        und: [
          {
            value: "",
          },
        ],
      },
      field_account_entity_postalcode: {
        und: [
          {
            value: "",
          },
        ],
      },
    }),
    []
  );

  return (
    <>
      <Form<AddEntityParams> onSubmit={onFormSubmit} state={initialState}>
        {({ submitForm }) => {
          return (
            <Stack fill>
              <Spinner visible={entityFormLoading}></Spinner>
              <IdFormItem />
              <Spacer size="small" />
              <TitleFormItem />
              <Spacer size="small" />
              <CityFormItem />
              <Spacer size="small" />
              <PostalCodeFormItem />
              <Spacer size="small" />

              <Button
                rounded={false}
                fontSize="normal"
                height={52}
                onTap={submitForm}
                disabled={loading}
                loading={loading}
              >
                {t("entities_list.add_new")}
              </Button>
            </Stack>
          );
        }}
      </Form>
      {error ? <ErrorPopup error={error} title="Unable to add entity" /> : null}
    </>
  );
}
