import { fileTypeFromFile } from 'file-type';
import fs from 'fs/promises';
import { isNil } from './guards.js';
import { Nullable } from './types.js';

export const renameFile = async (fromPath: string, toPath: string) => {
  try {
    await fs.rename(fromPath, toPath)
  } catch {
    return;
  }
}

export const changeExtension = async (file: string, ext: string): Promise<string> => {
  const newName = `${file.replace(/\..*/,'')}.${ext}`;
  await renameFile(file, newName);

  return newName;
}

export const removeFile = async (path: Nullable<string>) => {
  try {
    if (isNil(path)) {
      return;
    }

    fs.unlink(path);
  } catch {
    return;
  }
};

export const isImage = async (filePath: string): Promise<boolean> => {
  try {
    const result = await fileTypeFromFile(filePath);

    if (isNil(result)) {
      return false;
    }

    return result.mime.includes('image');
  } catch {
    return false;
  }
}

export const getExtension = async (filePath: string): Promise<Nullable<string>> => {
  try {
    const result = await fileTypeFromFile(filePath);

    if (isNil(result)) {
      return null;
    }

    return result.ext;
  } catch {
    return null;
  }
}
