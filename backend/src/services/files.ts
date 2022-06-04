import { join } from "path";
import { MakeServiceFN, ServiceCreator } from "./index.js";

type FilesServiceConfig = Readonly<{
  staticEndpoint: string;
  uploadedImagesFolder: string;
}>

const makeGetImageURL: MakeServiceFN<string, string, FilesServiceConfig> = (_, {staticEndpoint, uploadedImagesFolder}) => (
  imageName
) => join(staticEndpoint, uploadedImagesFolder, imageName)


export type FilesService = Readonly<{
  getImageURL: ReturnType<typeof makeGetImageURL>;
}>

const makeFilesServices: ServiceCreator<FilesService, FilesServiceConfig> = (config, serviceConfig) => ({
  getImageURL: makeGetImageURL(config, serviceConfig),
})

export default makeFilesServices;
