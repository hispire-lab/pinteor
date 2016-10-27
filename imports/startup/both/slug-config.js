import slug from 'slug';

slug.defaults.mode = 'pretty';
slug.defaults.modes.pretty = {
  // replace spaces with replacement
  replacement: '-',
  // replace unicode symbols or not
  symbols: true,
  // (optional) regex to remove characters
  remove: null,
  // result in lower case
  lower: true,
  // replace special characters
  charmap: slug.charmap,
  // replace multi-characters
  multicharmap: slug.multicharmap,
};
