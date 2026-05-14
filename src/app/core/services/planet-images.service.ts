import { Injectable } from '@angular/core';

/**
 * Maps planet and moon names to real public-domain NASA / Wikimedia image URLs.
 * All images are from NASA (public domain) or Wikimedia Commons (CC-BY or public domain).
 */

const PLANET_THUMB: Record<string, string> = {
  sun:     'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg/600px-thumbnail.jpg',
  mercury: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Mercury_in_true_color.jpg/600px-Mercury_in_true_color.jpg',
  venus:   'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Venus-real_color.jpg/600px-Venus-real_color.jpg',
  earth:   'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/600px-The_Earth_seen_from_Apollo_17.jpg',
  mars:    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/600px-OSIRIS_Mars_true_color.jpg',
  jupiter: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg/600px-Jupiter_and_its_shrunken_Great_Red_Spot.jpg',
  saturn:  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/600px-Saturn_during_Equinox.jpg',
  uranus:  'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Uranus2.jpg/600px-Uranus2.jpg',
  neptune: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg/600px-Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg',
};

const PLANET_GALLERY: Record<string, string[]> = {
  sun: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg/800px-thumbnail.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Solar_corona_scheme.png/800px-Solar_corona_scheme.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/2012_Transit_of_Venus_from_SF.jpg/800px-2012_Transit_of_Venus_from_SF.jpg',
  ],
  mercury: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Mercury_in_true_color.jpg/800px-Mercury_in_true_color.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Mercury_in_color_-_Prockter07-edit1.jpg/800px-Mercury_in_color_-_Prockter07-edit1.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Mercury_Globe-MESSENGER_mosaic_centered_at_0degN-0degE.jpg/800px-Mercury_Globe-MESSENGER_mosaic_centered_at_0degN-0degE.jpg',
  ],
  venus: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Venus-real_color.jpg/800px-Venus-real_color.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/PIA23791-Venus-RealAndEnhancedColor-20200608_%28cropped%29.jpg/800px-PIA23791-Venus-RealAndEnhancedColor-20200608_%28cropped%29.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Venus_globe.jpg/800px-Venus_globe.jpg',
  ],
  earth: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/800px-The_Earth_seen_from_Apollo_17.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Black_Marble_2016_-_Americas_%28composite%29.png/800px-Black_Marble_2016_-_Americas_%28composite%29.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Australia_and_New_Zealand_%28Suomi_NPP%29.jpg/800px-Australia_and_New_Zealand_%28Suomi_NPP%29.jpg',
  ],
  mars: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/800px-OSIRIS_Mars_true_color.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Mars_Valles_Marineris.jpeg/800px-Mars_Valles_Marineris.jpeg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Mars_from_Hubble_Space_Telescope_%28August_26%2C_2003%29.jpg/800px-Mars_from_Hubble_Space_Telescope_%28August_26%2C_2003%29.jpg',
  ],
  jupiter: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg/800px-Jupiter_and_its_shrunken_Great_Red_Spot.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Jupiter.jpg/800px-Jupiter.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Jupiter_and_Io.jpg/800px-Jupiter_and_Io.jpg',
  ],
  saturn: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/800px-Saturn_during_Equinox.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Saturn_-_November_2020.tiff/800px-Saturn_-_November_2020.tiff.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Saturn_from_Cassini_Orbiter_%282004-10-06%29.jpg/800px-Saturn_from_Cassini_Orbiter_%282004-10-06%29.jpg',
  ],
  uranus: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Uranus2.jpg/800px-Uranus2.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Uranus_as_seen_by_NASA%27s_Voyager_2_%28remastered%29_-_JPEG_converted.jpg/800px-Uranus_as_seen_by_NASA%27s_Voyager_2_%28remastered%29_-_JPEG_converted.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Uranus%2C_Earth_size_comparison_2.jpg/800px-Uranus%2C_Earth_size_comparison_2.jpg',
  ],
  neptune: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg/800px-Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Neptunio.jpg/800px-Neptunio.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Neptune_Voyager2_color_calibrated.png/800px-Neptune_Voyager2_color_calibrated.png',
  ],
};

const MOON_THUMB: Record<string, Record<string, string>> = {
  earth: {
    moon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/600px-FullMoon2010.jpg',
  },
  mars: {
    phobos: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Phobos_colour_2008.jpg/600px-Phobos_colour_2008.jpg',
    deimos: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Deimos-MRO.jpg/600px-Deimos-MRO.jpg',
  },
  jupiter: {
    io:       'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Io_highest_resolution_true_color.jpg/600px-Io_highest_resolution_true_color.jpg',
    europa:   'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Europa-moon-with-margins.jpg/600px-Europa-moon-with-margins.jpg',
    ganymede: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Ganymede_-_Perijove_34_Composite.png/600px-Ganymede_-_Perijove_34_Composite.png',
    callisto: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Callisto.jpg/600px-Callisto.jpg',
  },
  saturn: {
    titan:    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Titan_in_true_color.jpg/600px-Titan_in_true_color.jpg',
    rhea:     'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Rhea_-_PIA07763_%28color%29.jpg/600px-Rhea_-_PIA07763_%28color%29.jpg',
    iapetus:  'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Iapetus_as_seen_by_the_Cassini_probe_-_20071008_%28PIA08384%29.jpg/600px-Iapetus_as_seen_by_the_Cassini_probe_-_20071008_%28PIA08384%29.jpg',
    dione:    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Dione_in_natural_light.jpg/600px-Dione_in_natural_light.jpg',
    tethys:   'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Tethys_-_PIA17168_%28cropped%29.jpg/600px-Tethys_-_PIA17168_%28cropped%29.jpg',
    enceladus:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Enceladus_from_Voyager.jpg/600px-Enceladus_from_Voyager.jpg',
    mimas:    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Mimas_Cassini.jpg/600px-Mimas_Cassini.jpg',
  },
  uranus: {
    ariel:    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Ariel_%28moon%29.jpg/600px-Ariel_%28moon%29.jpg',
    umbriel:  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Umbriel_%28moon%29.jpg/600px-Umbriel_%28moon%29.jpg',
    titania:  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Titania_%28moon%29_color_cropped.jpg/600px-Titania_%28moon%29_color_cropped.jpg',
    oberon:   'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Voyager_2_picture_of_Oberon.jpg/600px-Voyager_2_picture_of_Oberon.jpg',
    miranda:  'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Miranda.jpg/600px-Miranda.jpg',
  },
  neptune: {
    triton:  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Triton_moon_mosaic_Voyager_2_%28large%29.jpg/600px-Triton_moon_mosaic_Voyager_2_%28large%29.jpg',
    proteus: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Proteus_%28Voyager_2%29.jpg/600px-Proteus_%28Voyager_2%29.jpg',
  },
};

const FALLBACK_PLANET = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/600px-The_Earth_seen_from_Apollo_17.jpg';
const FALLBACK_MOON   = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/600px-FullMoon2010.jpg';

@Injectable({ providedIn: 'root' })
export class PlanetImagesService {
  /** Returns the thumbnail URL for a planet (used in cards, galaxy view, etc.) */
  planetThumb(name: string): string {
    return PLANET_THUMB[name.toLowerCase()] ?? FALLBACK_PLANET;
  }

  /** Returns the CSS background-image value for a planet thumbnail */
  planetThumbUrl(name: string): string {
    return `url(${this.planetThumb(name)})`;
  }

  /** Returns the CSS background-image value for a moon */
  moonThumbUrl(planetName: string, moonName: string): string {
    const url = MOON_THUMB[planetName.toLowerCase()]?.[moonName.toLowerCase()] ?? FALLBACK_MOON;
    return `url(${url})`;
  }

  /** Returns gallery image URLs for a planet (for the image modal) */
  planetGallery(name: string): string[] {
    return PLANET_GALLERY[name.toLowerCase()] ?? [this.planetThumb(name)];
  }
}
