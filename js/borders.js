/**
 * Border registry.
 * Each entry: { id, name, src (path relative to root), innerR }
 * innerR: radius in canvas pixels (out of 256) where the portrait clips.
 * To add a new border: drop a 512×512 PNG in assets/borders/ and add an entry here.
 */
const BORDERS = [
  { id: 'iron-ring',       name: 'Iron Ring',       src: 'assets/borders/iron-ring.png',       innerR: 200 },
  { id: 'celtic-gold',     name: 'Celtic Gold',     src: 'assets/borders/celtic-gold.png',     innerR: 184 },
  { id: 'vine-serpent',    name: 'Vine Serpent',    src: 'assets/borders/vine-serpent.png',    innerR: 186 },
  { id: 'blood-ruby',      name: 'Blood Ruby',      src: 'assets/borders/blood-ruby.png',      innerR: 181 },
  { id: 'runic-amethyst',  name: 'Runic Amethyst',  src: 'assets/borders/runic-amethyst.png',  innerR: 185 },
  { id: 'sapphire-knot',   name: 'Sapphire Knot',   src: 'assets/borders/sapphire-knot.png',   innerR: 190 },
  { id: 'dragon-coil',     name: 'Dragon Coil',     src: 'assets/borders/dragon-coil.png',     innerR: 183 },
  { id: 'dwarven-rune',    name: 'Dwarven Rune',    src: 'assets/borders/dwarven-rune.png',    innerR: 179 },
  { id: 'iron-barb',       name: 'Iron Barb',       src: 'assets/borders/iron-barb.png',       innerR: 183 },
  { id: 'copper-vine',     name: 'Copper Vine',     src: 'assets/borders/copper-vine.png',     innerR: 181 },
];
