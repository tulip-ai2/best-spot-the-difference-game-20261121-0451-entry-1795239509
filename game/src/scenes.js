// Scene registry: maps scene ids to their painter module, display name and
// the difference slots the painter knows how to render.

import * as harbor from './scenes/harbor.js';
import * as attic from './scenes/attic.js';
import * as market from './scenes/market.js';
import * as greenhouse from './scenes/greenhouse.js';
import * as observatory from './scenes/observatory.js';
import * as workshop from './scenes/workshop.js';

export const SCENES = {
  harbor: { name: 'Harbor at Dusk', slots: harbor.SLOTS, paint: harbor.paint },
  attic: { name: "Clockmaker's Attic", slots: attic.SLOTS, paint: attic.paint },
  market: { name: 'Night Market', slots: market.SLOTS, paint: market.paint },
  greenhouse: { name: 'Glasshouse Greens', slots: greenhouse.SLOTS, paint: greenhouse.paint },
  observatory: { name: 'The Old Observatory', slots: observatory.SLOTS, paint: observatory.paint },
  workshop: { name: 'Toy Workshop', slots: workshop.SLOTS, paint: workshop.paint },
};
