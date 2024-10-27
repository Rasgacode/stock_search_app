import { getClient, IConfigCatClient } from "configcat-js-ssr";

export const configCatClient: IConfigCatClient = getClient(process.env.NEXT_PUBLIC_CONFIGCAT_SDK_KEY || "");
