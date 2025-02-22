export const preventDefaults = (e: Event) => {
  e.preventDefault();
  e.stopPropagation();
};
