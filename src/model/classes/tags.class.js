import { arrayToObject } from 'lib/decorators';

export default class Tags {
  /**
   * Check localStorage if has any tags object and try to
   * parse it.
   *
   * If, by mistake, tags from cache is an Array, transform it
   * to Object
   *
   * @returns {Object}
   */
  static getFromCache() {
    let tags = {};
    const cachedTags = localStorage.getItem('tagsv2');

    try {
      const parsed = JSON.parse(cachedTags);

      if (Array.isArray(parsed)) {
        tags = arrayToObject(parsed, 'id');
      } else {
        tags = parsed || {};
      }
    } catch (error) {
      // @todo: find a way to handle this error
    }

    return tags;
  }

  static setToCache(payload) {
    localStorage.setItem('tagsv2', JSON.stringify(payload));
  }


  constructor(tags) {
    this.tags = tags;
  }

  /**
   * Find the elements with the current name
   *
   * @param {String} name
   * @return {Array}
   */
  getTagByName(name) {
    if (Array.isArray(this.tags)) {
      return this.tags.filter(el =>
        el.name.toLowerCase() === name.toLowerCase());
    }

    return Object.keys(this.tags).reduce((acc, key) => {
      const el = this.tags[key];
      if (el.name.toLowerCase() === name.toLowerCase()) {
        return acc.concat([el]);
      }
      return acc;
    }, []);
  }

  /**
   * Get the element with the same ID
   *
   * @param {String} id
   * @return {Object}
   */
  getTagById(id) {
    if (Array.isArray(this.tags)) {
      return this.tags.filter(el => el.id === id)[0] || {};
    }

    return this.tags[id] || {};
  }
}
