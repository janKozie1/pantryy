import { PoolClient } from 'pg';
import { Request } from 'express';

import { RouteInitializer } from '../index.js';
import { withPrefix } from '../../utils/routes.js';
import protectedRoute from '../../middleware/protectedRoute.js';
import { Nullable, PartialWithNulls, ValidationResponse } from '../../utils/types.js';
import { id, withClient } from '../../utils/fn.js';
import {
  isEmpty, isNil, isObjectWithKeys, isObjectWithPartialKeys,
} from '../../utils/guards.js';
import { errorMessages } from '../../utils/validation.js';
import {
  changeExtension, getExtension, isImage, removeFile,
} from '../../utils/files.js';
import { Services } from '../../services/index.js';

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

const validateCreateItemBody = async (body: unknown, file: Nullable<Express.Request['file']>): Promise<CreatePantryItemResponse> => {
  const emptyErrors = {
    name: null,
    image: null,
    description: null,
    unit: null,
  };

  if (!isObjectWithKeys(body, ['name', 'description', 'unit'])) {
    return {
      ok: false,
      validData: null,
      errors: {
        ...emptyErrors,
        name: errorMessages.NOT_EMPTY,
        description: errorMessages.NOT_EMPTY,
        unit: errorMessages.NOT_EMPTY,
      },
    };
  }

  if (isNil(file)) {
    return {
      ok: false,
      validData: null,
      errors: {
        ...emptyErrors,
        image: errorMessages.NOT_EMPTY,
      },
    };
  }

  const extension = await getExtension(file.path);
  if (!(await isImage(file.path)) || isNil(extension)) {
    return {
      ok: false,
      validData: null,
      errors: {
        ...emptyErrors,
        image: errorMessages.NOT_IMAGE,
      },
    };
  }

  const { description, name, unit } = body;

  return {
    ok: true,
    validData: {
      name, unit, description, image: { file, extension },
    },
    errors: {},
  };
};

type UpdatePantryItemRequest = PartialWithNulls<CreatePantryItemRequest> & Readonly<{
  id: string;
}>

type UpdatePantryItemResponse = ValidationResponse<UpdatePantryItemRequest>;

const validateUpdateItemBody = async (body: unknown, file: Nullable<Express.Request['file']>, id: string): Promise<UpdatePantryItemResponse> => {
  const emptyErrors = {
    id: null,
    name: null,
    image: null,
    description: null,
    unit: null,
  };

  if (isEmpty(id)) {
    return {
      ok: false,
      validData: null,
      errors: {
        ...emptyErrors,
        id: errorMessages.NOT_EMPTY,
      },
    };
  }

  if (!isObjectWithPartialKeys(body, ['name', 'description', 'unit'])) {
    return {
      ok: false,
      validData: null,
      errors: emptyErrors,
    };
  }

  if (!isNil(file) && !(await isImage(file.path))) {
    return {
      ok: false,
      validData: null,
      errors: {
        ...emptyErrors,
        image: errorMessages.NOT_IMAGE,
      },
    };
  }

  const { description, name, unit } = body;
  const extension = isNil(file) ? null : await getExtension(file.path);

  return {
    ok: true,
    validData: {
      id, name, unit, description, image: isNil(extension) || isNil(file) ? null : { file, extension },
    },
    errors: {},
  };
};

const createNewProduct = async (
  client: PoolClient,
  req: Request,
  services: Services,
  data: NonNullable<CreatePantryItemResponse['validData']>,
  fileName: string,
): Promise<boolean> => {
  const user = services.auth.decodeToken(services.auth.getToken(req));

  try {
    await client.query('BEGIN');

    const productDetails = await client.query(
      'INSERT INTO products_details(product_name, product_description, product_image_url, measurment_unit_id) VALUES ($1, $2, $3, $4) RETURNING product_detail_id;',
      [data.name, data.description, fileName, data.unit],
    );

    const detailsId = productDetails.rows[0]?.product_detail_id;

    const userProduct = await client.query(
      'INSERT into products (user_id, product_detail_id) SELECT users.user_id, $1 from users where users.user_email=$2',
      [detailsId, user?.email],
    );

    await client.query('COMMIT');
    return productDetails.rowCount === 1 && userProduct.rowCount === 1;
  } catch {
    await client.query('ROLLBACK');
    return false;
  }
};

type UserProduct = Readonly<{
  id: string;
  name: string;
  description: string;
  imageURL: string;
  unitId: string;
}>

const getUserProduct = async (
  client: PoolClient,
  req: Request,
  services: Services,
  productId: Nullable<string>,
): Promise<Nullable<UserProduct>> => {
  const email = services.auth.decodeToken(services.auth.getToken(req))?.email;

  const user = await client.query('SELECT user_id from users where users.user_email = $1', [email]);
  const userId = user.rows[0].user_id;

  const result = await client.query(`SELECT
      P.product_id, PD.product_name, PD.product_description, PD.product_image_url, PD.measurment_unit_id
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
    description: product.product_description,
    unitId: product.measurment_unit_id,
  };
};

const updateUserProduct = async (
  client: PoolClient,
  req: Request,
  services: Services,
  data: NonNullable<UpdatePantryItemResponse['validData']>,
  fileName: Nullable<string>,
): Promise<boolean> => {
  const email = services.auth.decodeToken(services.auth.getToken(req))?.email;

  try {
    const user = await client.query('SELECT user_id from users where users.user_email = $1', [email]);
    const userId = user.rows[0].user_id;

    const productDetails = await client.query(`SELECT
        PD.product_detail_id
      FROM
        products_details as PD
      JOIN
        products as P
      ON
        P.product_detail_id = PD.product_detail_id
      WHERE
        P.product_id=$1
      AND
        P.user_id=$2;`, [data.id, userId]);

    const productDetailsId = productDetails.rows?.[0]?.product_detail_id;

    const result = await client.query(`UPDATE products_details
      SET
        product_name=COALESCE($2, product_name),
        product_description=COALESCE($3, product_description),
        product_image_url=COALESCE($4, product_image_url),
        measurment_unit_id=COALESCE($5, measurment_unit_id)
      WHERE
        product_detail_id=$1
    `, [productDetailsId, data.name, data.description, fileName, data.unit]);

    if (result.rowCount !== 1) {
      return false;
    }

    return true;
  } catch (err) {
    return false;
  }
};

const deleteUserProduct = async (
  client: PoolClient,
  req: Request,
  services: Services,
  productId: Nullable<string>,
): Promise<boolean> => {
  const email = services.auth.decodeToken(services.auth.getToken(req))?.email;

  try {
    const user = await client.query('SELECT user_id from users where users.user_email = $1', [email]);
    const userId = user.rows[0].user_id;

    const productDetails = await client.query(`SELECT
        PD.product_detail_id
      FROM
        products_details as PD
      JOIN
        products as P
      ON
        P.product_detail_id = PD.product_detail_id
      WHERE
        P.product_id=$1
      AND
        P.user_id=$2;
    `, [productId, userId]);

    const productDetailsId = productDetails.rows?.[0]?.product_detail_id;
    const response = await client.query('DELETE from products_details where product_detail_id=$1', [productDetailsId]);

    return response.rowCount === 1;
  } catch (err) {
    return false;
  }
};

const routes: RouteInitializer = (prefix, {
  app, services, upload, pool,
}) => {
  app.post(withPrefix(prefix, ''), protectedRoute({ services }), upload.single('image'), async (req, res) => {
    const { file } = req;
    const parsed = await validateCreateItemBody(req.body, file);

    if (!parsed.ok || isNil(parsed.validData)) {
      removeFile(file?.path);
      return res.json(parsed);
    }
    const fileName = `${parsed.validData.image.file.filename}.${parsed.validData.image.extension}`;
    const newFilePath = await changeExtension(parsed.validData.image.file.path, parsed.validData.image.extension);
    const didCreate = await withClient(createNewProduct, pool)(req, services, parsed.validData, fileName);

    if (!didCreate) {
      removeFile(newFilePath);
      return res.json(id<CreatePantryItemResponse>({
        ok: false,
        validData: null,
        errors: {},
      }));
    }

    return res.json(id<CreatePantryItemResponse>({
      ok: true,
      errors: {},
      validData: null,
    }));
  });

  app.patch(withPrefix(prefix, '/:id'), protectedRoute({ services }), upload.single('image'), async (req, res) => {
    const { file } = req;
    const parsed = await validateUpdateItemBody(req.body, file, req.params.id);

    if (!parsed.ok || isNil(parsed.validData)) {
      removeFile(file?.path);
      return res.json(parsed);
    }
    const fileName = !isNil(parsed.validData.image)
      ? `${parsed.validData.image.file.filename}.${parsed.validData.image.extension}` : null;
    const newFilePath = !isNil(parsed.validData.image)
      ? await changeExtension(parsed.validData.image.file.path, parsed.validData.image.extension) : null;
    const didUpdate = await withClient(updateUserProduct, pool)(req, services, parsed.validData, fileName);

    if (!didUpdate) {
      removeFile(newFilePath);
      return res.json(id<UpdatePantryItemResponse>({
        ok: false,
        validData: null,
        errors: {},
      }));
    }

    return res.json(id<UpdatePantryItemResponse>({
      ok: true,
      errors: {},
      validData: null,
    }));
  });

  app.delete(withPrefix(prefix, '/:id'), protectedRoute({ services }), async (req, res) => {
    const didDelete = await withClient(deleteUserProduct, pool)(req, services, req.params.id);

    if (!didDelete) {
      return res.json({ ok: false });
    }

    return res.json({ ok: true });
  });

  app.get(withPrefix(prefix, '/:id'), protectedRoute({ services }), async (req, res) => {
    const product = await withClient(getUserProduct, pool)(req, services, req.params.id);

    if (isNil(product)) {
      res.status(404);
      return res.json(null);
    }
    return res.json(id<UserProduct>(product));
  });
};

export default routes;
