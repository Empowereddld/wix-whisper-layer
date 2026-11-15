export const RESOURCE_LANGUAGES = ["English", "French", "Spanish", "Italian", "Catalan", "Welsh", "Persian", "Arabic", "Chinese", "Czech", "Jamaican Creole"];
export const RESOURCE_TYPES = ["poster", "guide", "checklist", "handout", "activity", "bundle", "infographic"];
export const resourceTypeLabel = (type: string) => ({ poster: "Strategy poster", handout: "Educational resource" }[type] || type.charAt(0).toUpperCase() + type.slice(1));
type Organized = { id: string; languages: string[] | null; resource_type: string; roles: string[] | null; translation_group_id?: string | null };
export const translationGroup = (resource: Pick<Organized, "id" | "translation_group_id">) => resource.translation_group_id || resource.id;
export const matchesLanguageAndType = (resource: Organized, languages: string[], types: string[]) =>
  (!languages.length || resource.languages?.some((language) => languages.includes(language))) &&
  (!types.length || types.includes(resource.resource_type));
export function relatedResources<T extends Organized>(resource: T, resources: T[]): T[] {
  const score = (candidate: T) =>
    (candidate.languages?.some((language) => resource.languages?.includes(language)) ? 100 : 0) +
    (translationGroup(candidate) === translationGroup(resource) ? 20 : 0) +
    (candidate.resource_type === resource.resource_type ? 10 : 0) +
    (candidate.roles?.some((role) => resource.roles?.includes(role)) ? 1 : 0);
  return resources.filter((candidate) => candidate.id !== resource.id).sort((a, b) => score(b) - score(a) || a.id.localeCompare(b.id)).slice(0, 3);
}
export function resourceFormat(resource: { file_format?: string | null; file_url: string | null }) {
  const extension = resource.file_format || resource.file_url?.split("?")[0].split(".").pop();
  return extension && /^(pdf|png|jpe?g|webp)$/i.test(extension) ? extension.toUpperCase() : "File";
}