import { useMutation } from '@immotech-feature/api';
import { ImageSource } from '@immotech-component/image-picker';
export type ProtocolInputType = {
  field_tp_assignment: string;
  field_tp_line_items: {
    und: ProtocolDataType[];
  };
};

export type ProtocolState = {
  status?: string;
  description?: string;
  imagesArray?: ImageSource[];
  skipEnabled?: boolean;
  fix?: string;
};

export type ProtocolsInsideProperty = {
  url: string;
  timestamp: string;
  filename: string;
};

export type ProtocolDataType = {
  field_tp_maintenance_obj?: string;
  field_tp_line_item_status?: {
    und?: string;
  };
  field_tp_diagnosis?: {
    und?: [
      {
        value?: string;
      },
    ];
  };
  field_tp_action?: {
    und?: [
      {
        value?: string;
      },
    ];
  };
  field_tp_line_item_pictures?: ImageSource[];
};

interface Response {
  nid: string;
  uri: string;
}

export function useAddProtocol() {
  return useMutation<Response, ProtocolInputType>('/api/app/test_process', {
    method: 'POST',
    mutationKey: ['protocols'],
  });
}
