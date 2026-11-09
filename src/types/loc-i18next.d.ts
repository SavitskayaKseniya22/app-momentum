declare module "loc-i18next" {
  import type { i18n } from "i18next";

  const locI18next: {
    init(instance: i18n): (selector: string, options?: { document?: ParentNode }) => void;
  };

  export default locI18next;
}
