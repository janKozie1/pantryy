import type { ServiceCreator, MakeServiceFN } from "."
import { generatePath } from "../utils/routes";
import type { Nullable } from "../utils/types";
import { isFile } from "../utils/validation";
import type { RequestResponse } from "./requests";

const getFormData = (arg: Record<string, string | Blob>): FormData => {
  const formData = new FormData();

  Object.entries(arg).forEach(([fieldName, fieldValue]) => {
    if (isFile(fieldValue)) {
      formData.append(fieldName, fieldValue, fieldValue.name);
    } else {
      formData.append(fieldName, fieldValue);
    }
  })

  return formData;
}

type ExternalDataServiceConfig = Readonly<{
  requestEndpoints: Readonly<{
    getMeasurmentUnits: string;
    createPantryItem: string;
    updatePantryItem: string;
    getPantryItem: string;
    deletePantryItem: string;
    getPantryItems: string;
  }>
}>

export type MeasurmentUnitsResponse = Readonly<{
  data: Readonly<{
    id: string;
    name: string;
  }>[]
}>

const makeGetMeasurmentUnits: MakeServiceFN<unknown, Promise<Nullable<MeasurmentUnitsResponse>>, ExternalDataServiceConfig> = ({fetch}, {requestEndpoints}) => async () => {
  try {
    const response = await fetch(requestEndpoints.getMeasurmentUnits);

    if (response.ok) {
      const body: MeasurmentUnitsResponse = await response.json();
      return body;
    }

    return null;
  } catch {
    return null;
  }
}

type CreatePantryItemRequest = Readonly<{
  name: string;
  image: File;
  description: string;
  unit: string;
}>

type CreatePantryItemReponse = RequestResponse<CreatePantryItemRequest>

const makeCreatePantryItem: MakeServiceFN<CreatePantryItemRequest, Promise<Nullable<CreatePantryItemReponse>>, ExternalDataServiceConfig> = ({fetch}, {requestEndpoints}) => async (
  data
) => {
  try {
    const response = await fetch(requestEndpoints.createPantryItem, {
      method: 'POST',
      body: getFormData(data),
    });

    if (response.ok) {
      const body: CreatePantryItemReponse = await response.json();
      return body;
    }

    return null;
  } catch {
    return null;
  }
}

type UpdatePantryItemRequest = CreatePantryItemRequest & Readonly<{
  id: string;
}>;

type UpdatePantryItemResponse = RequestResponse<UpdatePantryItemRequest>

const makeUpdatePantryItem: MakeServiceFN<UpdatePantryItemRequest, Promise<Nullable<UpdatePantryItemResponse>>, ExternalDataServiceConfig> = ({fetch}, {requestEndpoints}) => async (
  data
) => {
  const { id } = data;

  try {
    const response = await fetch(generatePath(requestEndpoints.updatePantryItem, { id }), {
      method: 'PATCH',
      body: getFormData(data),
    });

    if (response.ok) {
      const body: UpdatePantryItemResponse = await response.json();
      return body;
    }

    return null;
  } catch {
    return null;
  }
}

export type PantryItem = Readonly<{
  id: string;
  name: string;
  description: string;
  imageURL: string;
  unitId: string;
}>

type GetPantryItemsResponse = PantryItem[];

const makeGetPantryItems: MakeServiceFN<unknown, Promise<GetPantryItemsResponse>, ExternalDataServiceConfig> = ({fetch}, {requestEndpoints}) => async () => {
  try {
    const response = await fetch(requestEndpoints.getPantryItems);

    if (response.ok) {
      const body: GetPantryItemsResponse = await response.json();
      return body;
    }

  } catch {
    return []
  }
}

const makeGetPantryItem: MakeServiceFN<string, Promise<Nullable<PantryItem>>, ExternalDataServiceConfig> = ({fetch}, {requestEndpoints}) => async (
  id
) => {
  try {
    const response = await fetch(generatePath(requestEndpoints.getPantryItem, { id }));

    if (response.ok) {
      const body: PantryItem = await response.json();
      return body;
    }

  } catch {
    return null
  }
}

type DeletePantryItemResponse = RequestResponse<{}>;

const makeDeletePantryItem: MakeServiceFN<string, Promise<Nullable<DeletePantryItemResponse>>, ExternalDataServiceConfig> = ({fetch}, {requestEndpoints}) => async (
  id
) => {
  try {
    const response = await fetch(generatePath(requestEndpoints.deletePantryItem, { id }), {
      method: "DELETE"
    });

    if (response.ok) {
      const body: DeletePantryItemResponse = await response.json();
      return body;
    }
  } catch {
    return null;
  }
}

export type AuthService = Readonly<{
  getMeasurmentUnits: ReturnType<typeof makeGetMeasurmentUnits>;
  getPantryItems: ReturnType<typeof makeGetPantryItems>;
  createPantryItem: ReturnType<typeof makeCreatePantryItem>;
  getPantryItem: ReturnType<typeof makeGetPantryItem>;
  deletePantryItem: ReturnType<typeof makeDeletePantryItem>;
  updatePantryItem: ReturnType<typeof makeUpdatePantryItem>;
}>

const makeAuthService: ServiceCreator<AuthService, ExternalDataServiceConfig> = (config, serviceConfig) => ({
  getMeasurmentUnits: makeGetMeasurmentUnits(config, serviceConfig),
  getPantryItems: makeGetPantryItems(config, serviceConfig),
  createPantryItem: makeCreatePantryItem(config, serviceConfig),
  getPantryItem: makeGetPantryItem(config, serviceConfig),
  deletePantryItem: makeDeletePantryItem(config, serviceConfig),
  updatePantryItem: makeUpdatePantryItem(config, serviceConfig),
})

export default makeAuthService;
