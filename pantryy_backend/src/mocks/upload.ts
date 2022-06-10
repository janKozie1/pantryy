import { Multer } from 'multer';

const makeMockUpload = (): Multer => ({
  single: () => null,
} as unknown as Multer);

export default makeMockUpload;
