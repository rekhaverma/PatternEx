/**
 * Wrapper over window.location - required for unit testing
 * @type {{replace: (function(*=): void), origin: (function(): string)}}
 */
export const windowLocation = {
  replace: url => window.location.replace(url),
  origin: () => window.location.origin,
};
