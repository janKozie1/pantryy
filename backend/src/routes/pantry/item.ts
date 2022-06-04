import {  PoolClient } from "pg";
import { Request } from 'express';

import { RouteInitializer } from "../index.js";
import { withPrefix } from "../../utils/routes.js";
import protectedRoute from "../../middleware/protectedRoute.js";
import { Nullable, ValidationResponse } from "../../utils/types.js";
import { id, withClient } from "../../utils/fn.js";
import { isNil, isObjectWithKeys } from "../../utils/guards.js";
import { errorMessages } from "../../utils/validation.js";
import { changeExtension, getExtension, isImage, removeFile } from '../../utils/files.js';
import { Services } from "../../services/index.js";

type CreatePantryItemRequest = Readonly<{
  name: string;
  image: Readonly<{
    file: NonNullable<Express.Request['file']>;
    extension: string;
  }>;
  description: string;
  unit: string;
}>

type CreatePantryItemResponse = ValidationResponse<CreatePantryItemRequest>;

const validateBody = async (body: unknown, file: Nullable<Express.Request['file']>): Promise<CreatePantryItemResponse> => {
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

  const extension = await getExtension(file.path);
  if (!(await isImage(file.path)) || isNil(extension)) {
    return {
      ok: false,
      validData: null,
      errors: {
        ...emptyErrors,
        image: errorMessages.NOT_IMAGE,
      }
    }
  }

  const { description, name, unit,} = body;

  return {
    ok: true,
    validData: {name, unit, description, image: {file, extension} },
    errors: {}
  }
}

const createNewProduct = async (
  client: PoolClient,
  req: Request,
  services: Services,
  data: NonNullable<CreatePantryItemResponse['validData']>,
  fileName: string
): Promise<boolean> => {
  const user = services.auth.decodeToken(services.auth.getToken(req));

  try {
    await client.query('BEGIN');

    const productDetails = await client.query('INSERT INTO products_details(product_name, product_description, product_image_url, measurment_unit_id) VALUES ($1, $2, $3, $4) RETURNING product_detail_id;',
      [data.name, data.description, fileName, data.unit]
    );

    const detailsId = productDetails.rows[0]?.product_detail_id;

    const userProduct = await client.query('INSERT into products (user_id, product_detail_id) SELECT users.user_id, $1 from users where users.user_email=$2',
      [detailsId, user?.email]
    );

    await client.query('COMMIT');
    return productDetails.rowCount === 1 && userProduct.rowCount === 1;
  } catch {
    await client.query('ROLLBACK');
    return false;
  }
}

type UserProduct = Readonly<{
  id: string;
  name: string;
  description: string;
  imageURL: string;
}>

const getUserProduct = async (
  client: PoolClient,
  services: Services,
  email: Nullable<string>,
  productId: Nullable<string>
): Promise<Nullable<UserProduct>> => {
  if (isNil(productId)) {
    return null;
  }

  const user = await client.query('SELECT user_id from users where users.user_email = $1', [email]);
  const userId = user.rows[0].user_id;

  const result = await client.query(`SELECT
      P.product_id, PD.product_name, PD.product_description, PD.product_image_url
    FROM
      products_details as PD
    INNER JOIN
      products as P
    ON
      PD.product_detail_id=P.product_detail_id
    WHERE
      P.product_id=$1 AND P.user_id=$2
  `, [productId, userId]);

  if (result.rowCount !== 1) {
    return null;
  }

  const product = result.rows[0];

  return {
    id: product.product_id,
    imageURL: services.files.getImageURL(product.product_image_url),
    name: product.product_name,
    description: product.product_description
  };
}

const routes: RouteInitializer = (prefix, {app, services, upload, pool}) => {
  app.post(withPrefix(prefix, ''), protectedRoute({services}), upload.single('image'), async (req, res) => {
    const file: Nullable<Express.Request['file']> = req.file;
    const parsed = await validateBody(req.body, file);

    if (!parsed.ok || isNil(parsed.validData)) {
      removeFile(file?.path);
      return res.json(parsed);
    } else {
      const fileName = `${parsed.validData.image.file.filename}.${parsed.validData.image.extension}`;
      const newFilePath = await changeExtension(parsed.validData.image.file.path, parsed.validData.image.extension);
      const didCreate = await withClient(createNewProduct, pool)(req, services, parsed.validData, fileName)

      if (!didCreate) {
        removeFile(newFilePath);
        return res.json(id<CreatePantryItemResponse>({
          ok: false,
          validData: null,
          errors: {}
        }))
      }

      return res.json(id<CreatePantryItemResponse>({
        ok: true,
        errors: {},
        validData: null,
      }));
    }
  })

  app.get(withPrefix(prefix, '/:id'), protectedRoute({services}), async (req, res) => {
    const product = await withClient(getUserProduct, pool)(
      services,
      services.auth.decodeToken(services.auth.getToken(req))?.email,
      req.params.id,
    )

    if (isNil(product)) {
      res.status(404);
      return res.json({ok: false})
    } else {
      return res.json(id<UserProduct>(product));
    }
  })
}

export default routes;
