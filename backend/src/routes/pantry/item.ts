import fileType from 'file-type'

import { RouteInitializer } from "..";
import { withPrefix } from "../../utils/routes";
import protectedRoute from "../../middleware/protectedRoute";
import { Nullable, ValidationResponse } from "../../utils/types";
import { id } from "../../utils/fn";
import { isNil, isObjectWithKeys } from "../../utils/guards";
import { errorMessages } from "../../utils/validation";

type CreatePantryItemRequest = Readonly<{
  name: string;
  image: Express.Request['file'];
  description: string;
  unit: string;
}>

type CreatePantryItemResponse = ValidationResponse<CreatePantryItemRequest>;

const validateBody = (body: unknown, file: Nullable<Express.Request['file']>): CreatePantryItemResponse => {
  const emptyErrors = {
    name: null,
    image: null,
    description: null,
    unit: null,
  }

  if (!isObjectWithKeys(body, ['name', 'description', 'unit'])) {
    return {
      ok: false,
      validData: null,
      errors: {
        ...emptyErrors,
        name: errorMessages.NOT_EMPTY,
        description: errorMessages.NOT_EMPTY,
        unit: errorMessages.NOT_EMPTY,
      }
    }
  }

  if (isNil(file)) {
    return {
      ok: false,
      validData: null,
      errors: {
        ...emptyErrors,
        image: errorMessages.NOT_EMPTY,
      }
    }
  }

  const a = fileType.fileTypeFromBuffer(file.buffer);
  console.log({a})

  const { description, name, unit,} = body;


  return {
    ok: true,
    validData: {name, unit, description, image: file},
    errors: {}
  }
}

const routes: RouteInitializer = (prefix, {app, services, upload}) => {
  app.post(withPrefix(prefix, ''), protectedRoute({services}), upload.single('image'), async (req, res) => {
    const parsed = validateBody(req.body, req.file);

    res.json(id<CreatePantryItemResponse>({
      ok: false,
      errors: {
        description:  null,
        image: null,
        name: null,
        unit: null,
      },
      validData: null,
    }))
  })
}

export default routes;
