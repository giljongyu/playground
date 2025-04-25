import { createSafeContext } from "@xionwcfm/react";

export const [Provider, useStringContext] = createSafeContext<string>(null);
