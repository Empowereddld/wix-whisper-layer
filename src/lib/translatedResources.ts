export type PublishedTranslation = {
  id: string;
  languages: string[] | null;
  is_published: boolean;
};

// Use the same record IDs as the Resource Library, never a second catalogue.
export function translationsForLanguage<T extends PublishedTranslation>(resources: T[], language: string): T[] {
  return resources.filter((resource) => resource.is_published && resource.languages?.some((value) => value.trim().toLowerCase() === language.trim().toLowerCase()));
}

export const translatedResourcePath = (resource: Pick<PublishedTranslation, "id">) => `/hub/resource/${resource.id}`;