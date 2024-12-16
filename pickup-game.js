const max_nominations = 3;

const vote_duration = 30; // in seconds

const team_sizes = {
  ones: { description: '1v1', pool: 2 }, 
  twos: { description: '2v2', pool: 4 },
  threes: { description: '3v3', pool: 6 },
  fours: { description: '4v4', pool: 8 },
  fives: { description: '5v5', pool: 10 },
};

const captain_modes = {
  shuffle: { description: 'teams are assigned randomly' },
  shuffle_capts: { description: 'two captains are randomly chosen, who then pick their teams' },
  admin_pick: { description: 'pug admin chooses 2 captains, who then choose their teams' },
  admin_rand_capts: { description: 'pug admin provides a list of players for consideration; bot then picks two randomly from the given options' },
  // skill_capts: { description: 'the two players with the highest ELO are chosen as captains, and they then pick the teams'},
  // skill_shuffle: { description: 'bot attempts to pick teams with similar average ELOs'}
};

let nominated = [];
let pool = [];

let teams = {
  red: [], // DEFENSE
  blue: [], // OFFENSE
};

const maps = {
  ff_blockfort: { description: 'ff_blockfort' },
  ff_dustbowl: { description: 'ff_dustbowl' },
  ff_roastedr: { description: 'ff_roastedr' },
  ff_anticitizen: { description: 'ff_anticitizen' },
  ff_cannon: { description: 'ff_cannon' },
  ff_chimkeyz_b5: { description: 'ff_chimkeyz_b5' },
  ff_ksour: { description: 'ff_ksour' },
  ff_raiden3_b1: { description: 'ff_raiden3_b1' },
  ff_complex_b2: { description: 'ff_complex_b2' },
  ff_avanti_classic: { description: 'ff_avanti_classic' },
  ff_blis_2fort: { description: 'ff_blis_2fort' },
  ff_cz2: { description: 'ff_cz2' },
  ff_fidd_l: { description: 'ff_fidd_l' },
  ff_openfire: { description: 'ff_openfire' },
  ff_hollow_b4: { description: 'ff_hollow_b4' },
  ff_prolifique_b2: { description: 'ff_prolifiquee_b2' },
  ff_schrape_b4: { description: 'ff_schrape_b4' },
  ff_siden_b2: { description: 'ff_siden_b2' },
  ff_baked_b2: { description: 'ff_baked_b2' },
  ff_bleepbloop_b3: { description: 'ff_bleepbloop_b3' },
  ff_changeofpace: { description: 'ff_changeofpace' },
  ff_congestus: { description: 'ff_congestus' },
  ff_epicenter: { description: 'ff_epicenter' },
  ff_hellion_classic: { description: 'ff_hellion_classic' },
  ff_pitfall: { description: 'ff_pitfall' },
  ff_tidalwave_b4: { description: 'ff_tidalwave_b4' },
  ff_warpath: { description: 'ff_warpath' },
  ff_well: { description: 'ff_well' },
  ff_2morforever: { description: 'ff_2morforever' },
  ff_siege_classic: { description: 'ff_siege_classic' },
  ff_waterhazard: { description: 'ff_waterhazard' },
  ff_flowb2: { description: 'ff_flowb2' },
  ff_stowaway_b2: { description: 'ff_stowaway_b2' },
  ff_tiger: { description: 'ff_tiger' },
  ff_oppose_b4: { description: 'ff_oppose_b4' },
  ff_orbit_b1: { description: 'ff_orbit_b1' },
  ff_schtop: { description: 'ff_schtop' },
  ff_shutdown2: { description: 'ff_shutdown2' },
  ff_startec: { description: 'ff_startec' },
  ff_argon_beta_1: { description: 'ff_argon_beta_1' },
  ff_aardvark: { description: 'ff_aardvark' },
  ff_cornfield: { description: 'ff_cornfield' },
  ff_2mesa3_classic: { description: 'ff_2mesa3_classic' },
  ff_dropdown: { description: 'ff_dropdown' },
  ff_mortality_gz_b1: { description: 'ff_mortality_gz_b1' },
  ff_swoop_b2: { description: 'ff_swoop_b2' },
  ff_amped: { description: 'ff_amped' },
  ff_attribute_b2: { description: 'ff_attribute_b2' },
  ff_flashpoint_b3_fix: { description: 'ff_flashpoint_b3_fix' },
  ff_plasma_beta1: { description: 'ff_plasma_beta1' },
  ff_venganza_b1: { description: 'ff_venganza_b1' },
  ff_crossover: { description: 'ff_crossover' },
  ff_deadfall: { description: 'ff_deadfall' },
  ff_flare: { description: 'ff_flare' },
  ff_monkey: { description: 'ff_monkey' },
  ff_session: { description: 'ff_session' },
  ff_vertigo: { description: 'ff_vertigo' },
  ff_evenflow_b2: { description: 'ff_evenflow_b2' },
  ff_fragzone_g: { description: 'ff_fragzone_g' },
  ff_high_flag_b4: { description: 'ff_high_flag_b4' },
  ff_mitair: { description: 'ff_mitair' },
  ff_push: { description: 'ff_push' },
  ff_xpress_b1: { description: 'ff_xpress_b1' },
  ff_dalequandary_b2: { description: 'ff_dalequandary_b2' },
  ff_alchimy_b1: { description: 'ff_alchimy_b1' },
  ff_frozen_b2: { description: 'ff_frozen_b2' },
  ff_fusion: { description: 'ff_fusion' },
  ff_maya: { description: 'ff_maya' },
  ff_napoli: { description: 'ff_napoli' },
  ff_redgiant: { description: 'ff_redgiant' },
  ff_sahara_b1: { description: 'ff_sahara_b1' },
  ff_sonic: { description: 'ff_sonic' },
  ff_ameliorate_b2: { description: 'ff_ameliorate_b2' },
  ff_circa_b2: { description: 'ff_circa_b2' },
  ff_meltdown: { description: 'ff_meltdown' },
  ff_nyx_b2: { description: 'ff_nyx_b2' },
  ff_palermo: { description: 'ff_palermo' },
  ff_resolve_b2: { description: 'ff_resolve_b2' },
  ff_security_b1: { description: 'ff_security_b1' },
  ff_attrition: { description: 'ff_attrition' },
  ff_badlands_beta9: { description: 'ff_badlands_beta9' },
  ff_bases: { description: 'ff_bases' },
  ff_catharsis_b4: { description: 'ff_catharsis_b4' },
  ff_destroy: { description: 'ff_destroy' },
  ff_genesis: { description: 'ff_genesis' },
  ff_medieval_b11: { description: 'ff_medieval_b11' },
  ff_protein: { description: 'ff_protein' },
  ff_reloaded_b1: { description: 'ff_reloaded_b1' },
  ff_spiderx: { description: 'ff_spiderx' },
  ff_waterpolo: { description: 'ff_waterpolo' },
  ff_blitz: { description: 'ff_blitz' },
  ff_charybda: { description: 'ff_charybda' },
  ff_flag4sky_b1: { description: 'ff_flag4sky_b1' },
  ff_shutdown1: { description: 'ff_shutdown1' },
  ff_torch_beta2: { description: 'ff_torch_beta2' },
  ff_descent_a0: { description: 'ff_descent_a0' },
  ff_ibex_b1: { description: 'ff_ibex_b1' },
  ff_cavern_b1: { description: 'ff_cavern_b1' },
  ff_trench_b4: { description: 'ff_trench_b4' },
  ff_waldo_b1: { description: 'ff_waldo_b1' },
  ff_zion_b1: { description: 'ff_zion_b1' },
  ff_quark_classic: { description: 'ff_quark_classic' },
  ff_myth_b2: { description: 'ff_myth_b2' },
  ff_destroy_xmas_a3: { description: 'ff_destroy_xmas_a3' },
  ff_duality: { description: 'ff_duality' },
  ff_mystique_a0: { description: 'ff_mystique_a0' },
  ff_sunnyramps_b1: { description: 'ff_sunnyramps_b1' },
  ff_mystique_a4: { description: 'ff_mystique_a4' },
  ff_warmonch: { description: 'ff_warmonch' },
  ff_2bases: { description: 'ff_2bases' },
  ff_volleyball: { description: 'ff_volleyball' },
  ff_dm_squeek: { description: 'ff_dm_squeek' },
  ff_jeepball_b2: { description: 'ff_jeepball_b2' },
  ff_mulch_dm_b2: { description: 'ff_mulch_dm_b2' },
  ff_ass_dm: { description: 'ff_ass_dm' },
  ff_phantom_r: { description: 'ff_phantom_r' },
  ff_oblivion_b5: { description: 'ff_oblivion_b5' },
  ff_stowaway2: { description: 'ff_stowaway2' },
  ff_waterpolo_2006: { description: 'ff_waterpolo_2006' },
  ff_talos_warehouse: { description: 'ff_talos_warehouse' },
  ff_fuxbox: { description: 'ff_fuxbox' },
  ff_r123: { description: 'ff_r123' },
  ff_rock2_qnd_b8: { description: 'ff_rock2_qnd_b8' },
  ff_phantom_pu: { description: 'ff_phantom_pu' },
  ff_dong: { description: 'ff_dong' },
  ff_2fort: { description: 'ff_2fort' },
  ff_propinquity_b4: { description: 'ff_propinquity_b4' },
  ff_boketto_b1: { description: 'ff_boketto_b1' },
  ff_hydro_b1: { description: 'ff_hydro_b1' },
};

export function getMaps() {
  return Object.keys(maps);
}

export function rockTheVote() {
  console.log('voting has started');
  console.log('nominated:', nominated);
}

export function nominate(map) {
  if (maps.includes(map) && nominated.length < max_nominations) {
    nominated.push(map);
  }
}

// Function to fetch shuffled options for select menu
export function getShuffledOptions(choices) {

  const allChoices = choices.shuffle();
  const options = [];

  for (let choice of allChoices) {
    // Formatted for select menus
    // https://discord.com/developers/docs/interactions/message-components#select-menu-object-select-option-structure
    options.push({
      label: choice,
      value: choice,
      description: maps[c]['description'],
    });
  }

  return options.sort(() => Math.random() - 0.5);
}
