import type { ServiceCreator, MakeServiceFN } from "."
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
    measurmentUnits: string;
    pantryItem: string
    pantryItems: string;
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
    const response = await fetch(requestEndpoints.measurmentUnits);

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
    const response = await fetch(requestEndpoints.pantryItem, {
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

export type PantryItem = Readonly<{
  id: string;
  name: string;
  description: string;
  imageURL: string;
}>

type GetPantryItemsResponse = PantryItem[];

const makeGetPantryItems: MakeServiceFN<unknown, Promise<GetPantryItemsResponse>, ExternalDataServiceConfig> = ({fetch}, {requestEndpoints}) => async () => {
  try {
    const response = await fetch(requestEndpoints.pantryItems);


    if (response.ok) {
      const body: GetPantryItemsResponse = await response.json();
      return body;
    }

  } catch {
    return []
  }
}

export type AuthService = Readonly<{
  getMeasurmentUnits: ReturnType<typeof makeGetMeasurmentUnits>;
  createPantryItem: ReturnType<typeof makeCreatePantryItem>;
  getPantryItems: ReturnType<typeof makeGetPantryItems>;
}>

const makeAuthService: ServiceCreator<AuthService, ExternalDataServiceConfig> = (config, serviceConfig) => ({
  getMeasurmentUnits: makeGetMeasurmentUnits(config, serviceConfig),
  createPantryItem: makeCreatePantryItem(config, serviceConfig),
  getPantryItems: makeGetPantryItems(config, serviceConfig),
})

export default makeAuthService;
