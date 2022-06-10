import { Services } from "../services/index.js";
import { PartialDeepObject } from "../utils/types.js"

type CustomMocks = PartialDeepObject<Services>;

const makeMockServices = (customMocks: CustomMocks): Services => ({
  auth: {
    decodeToken: () => null,
    getToken: () => null,
    isLoggedIn: () => false,
    login: () => null,
    ...customMocks.auth,
  },
  files: {
    getImageURL: () => '',
    ...customMocks.files,
  }
})

export default makeMockServices
