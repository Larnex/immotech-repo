import AsyncStorage  from '@react-native-async-storage/async-storage';
import { Entity, useEntities } from '@immotech-feature/entity-api';
import { createStore, persist, Store, action } from 'easy-peasy';

interface ProtocolModel {
    id: string;
    started: boolean;
}

interface RootModel {
    protocol: ProtocolModel;
}



export const store = createStore({
    forms: {
      addForm: action((state, payload) => {
        state.forms = {
          ...state.forms,
          [payload.maintenanceId]: {
            ...payload,
            statusState: "",
            setStatusState: action((state, status) => {
              state.forms[payload.maintenanceId].statusState = status;
            }),
          },
        };
      }),
    },
  });