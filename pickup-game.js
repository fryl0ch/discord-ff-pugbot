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

let pool = {
  red: [], // DEFENSE
  blue: [], // OFFENSE
  pool: [] // player not picked yet, or pug not started yet and pug still filling
};

let started = false;

export let game = null;

export function pickup() {
  if (started !== true)
  {
    started = true;
    game = { 
            size: team_sizes.fours,
            nominated: nominated,
            mode: captain_modes.shuffle,
            pool: pool,
            map: null,
          };
    return 'a pickup has been started!'
  }
  else if (started === true)
  {
    return 'a pug has already been started!';
  }
}

export function end() {
  if (started === true)
  {
    started = false;
    game = null;
    return 'pickup ended';
  }
  else
    return 'there is no pickup running';
}

export function add(player) {
  if (!pool.includes(player))
  {
    pool.pool.push(player)
    return `${player} has joined the pickup! ${pool.pool.length}/${game.size}`;
  }
  else
    return `${player} is already in the pool!`
}

export function teams() {
  if (!started)
    return 'there is no pickup running';
  else
    return pool;
}

export function remove(player) {
  if (started === true)
  {
    if (pool.pool.includes(player))
    {
      pool = pool.pool.filter((p) => {
        if (p === player)
          return false;
        else
          return true;
      });
      return `${player} has left the building`
    }
    else
      return `${player} isn't even added!`;
  }
  else
    return `there's no pickup running yet! /pickup to start one.`
}


const maps = {
  ff_blockfort: { description: 'ff_blockfort' },
  ff_dustbowl: { description: 'ff_dustbowl' },
  ff_roastedr: { description: 'ff_roastedr' },
  ff_anticitizen: { description: 'ff_anticitizen' },
  ff_cannon: { description: 'ff_cannon' },
  ff_chimkeyz_b5: { description: 'ff_chimkeyz_b5', aliases: ['chimkey', 'chimkeyz'] },
  ff_ksour: { description: 'ff_ksour' },
  ff_raiden3_b1: { description: 'ff_raiden3_b1', aliases: ['raiden', 'raiden3'] },
  ff_complex_b2: { description: 'ff_complex_b2', aliases: ['complex'] },
  ff_avanti_classic: { description: 'ff_avanti_classic', aliases: ['avant', 'avanti'] },
  ff_blis_2fort: { description: 'ff_blis_2fort', aliases: ['blis', 'blisfort'] },
  ff_cz2: { description: 'ff_cz2', aliases: ['cz2'] },
  ff_fidd_l: { description: 'ff_fidd_l', aliases: ['fiddle', 'fiddl'] },
  ff_openfire: { description: 'ff_openfire' },
  ff_hollow_b4: { description: 'ff_hollow_b4', aliases: ['hollow'] },
  ff_prolifique_b2: { description: 'ff_prolifiquee_b2', aliases: ['prolifique', 'prolif'] },
  ff_schrape_b4: { description: 'ff_schrape_b4', aliases: ['schrape'] },
  ff_siden_b2: { description: 'ff_siden_b2', aliases: ['siden'] },
  ff_baked_b2: { description: 'ff_baked_b2', aliases: ['baked'] },
  ff_bleepbloop_b3: { description: 'ff_bleepbloop_b3', aliases: ['robots', 'bleep', 'bloop', 'dinosaurs'] },
  ff_changeofpace: { description: 'ff_changeofpace', aliases: ['cop'] },
  ff_congestus: { description: 'ff_congestus', aliases: ['cong'] },
  ff_epicenter: { description: 'ff_epicenter', aliases: ['epi', 'epic'] },
  ff_hellion_classic: { description: 'ff_hellion_classic', aliases: ['hellion', 'hell'] },
  ff_pitfall: { description: 'ff_pitfall' },
  ff_tidalwave_b4: { description: 'ff_tidalwave_b4', aliases: ['tidal', 'vagina', 'vag'] },
  ff_warpath: { description: 'ff_warpath' },
  ff_well: { description: 'ff_well' },
  ff_2morforever: { description: 'ff_2morforever', aliases: ['2more', '2mor'] },
  ff_siege_classic: { description: 'ff_siege_classic', aliases: ['siege'] },
  ff_waterhazard: { description: 'ff_waterhazard' },
  ff_flowb2: { description: 'ff_flowb2', aliases: ['flow'] },
  ff_stowaway_b2: { description: 'ff_stowaway_b2', aliases: ['stow', 'stowaway'] },
  ff_tiger: { description: 'ff_tiger' },
  ff_oppose_b4: { description: 'ff_oppose_b4', aliases: ['oppose'] },
  ff_orbit_b1: { description: 'ff_orbit_b1', aliases: ['orbit'] },
  ff_schtop: { description: 'ff_schtop', aliases: ['schtop.fox', 'schtop,fox', 'fox', 'schtop', 'buttonsg'] },
  ff_shutdown2: { description: 'ff_shutdown2', aliases: ['sd2'] },
  ff_startec: { description: 'ff_startec' },
  ff_argon_beta_1: { description: 'ff_argon_beta_1', aliases: ['argon'] },
  ff_aardvark: { description: 'ff_aardvark', aliases: ['aard', 'aardy'] },
  ff_cornfield: { description: 'ff_cornfield', aliases: ['corn'] },
  ff_2mesa3_classic: { description: 'ff_2mesa3_classic', aliases: ['2mesa', '2mesa3', '3mesa2'] },
  ff_dropdown: { description: 'ff_dropdown' },
  ff_mortality_gz_b1: { description: 'ff_mortality_gz_b1', aliases: ['morty', 'mortality', 'mort', 'fruitcake'] },
  ff_swoop_b2: { description: 'ff_swoop_b2', aliases: ['swoop'] },
  ff_amped: { description: 'ff_amped' },
  ff_attribute_b2: { description: 'ff_attribute_b2', aliases: ['attribute', 'attr'] },
  ff_flashpoint_b3_fix: { description: 'ff_flashpoint_b3_fix', aliases: ['flash', 'flashpoint'] },
  ff_plasma_beta1: { description: 'ff_plasma_beta1', aliases: ['plasma'] },
  ff_venganza_b1: { description: 'ff_venganza_b1', aliases: ['venganza'] },
  ff_crossover: { description: 'ff_crossover', aliases: ['xover', 'cross'] },
  ff_deadfall: { description: 'ff_deadfall' },
  ff_flare: { description: 'ff_flare' },
  ff_monkey: { description: 'ff_monkey', aliases: ['jungle', 'monkey', 'monkey_r', 'ff_dehydrated', 'dehydrated', 'dehydrate'] },
  ff_session: { description: 'ff_session', aliases: ['sesh'] },
  ff_vertigo: { description: 'ff_vertigo' },
  ff_evenflow_b2: { description: 'ff_evenflow_b2', aliases: ['evenflow'] },
  ff_fragzone_g: { description: 'ff_fragzone_g', aliases: ['fragzone'] },
  ff_high_flag_b4: { description: 'ff_high_flag_b4', aliases: ['highflag', 'high_flag'] },
  ff_mitair: { description: 'ff_mitair' },
  ff_push: { description: 'ff_push' },
  ff_xpress_b1: { description: 'ff_xpress_b1', aliases: ['xpress', '2v2'] },
  ff_dalequandary_b2: { description: 'ff_dalequandary_b2', aliases: ['dale', 'dalequandary'] },
  ff_alchimy_b1: { description: 'ff_alchimy_b1', aliases: ['alchemy', 'alchimy', 'alchy'] },
  ff_frozen_b2: { description: 'ff_frozen_b2', aliases: ['frozen', 'olaf'] },
  ff_fusion: { description: 'ff_fusion' },
  ff_maya: { description: 'ff_maya' },
  ff_napoli: { description: 'ff_napoli' },
  ff_redgiant: { description: 'ff_redgiant' },
  ff_sahara_b1: { description: 'ff_sahara_b1', aliases: ['sand', 'sahara'] },
  ff_sonic: { description: 'ff_sonic' },
  ff_ameliorate_b2: { description: 'ff_ameliorate_b2', aliases: ['ameliorate', 'amel'] },
  ff_circa_b2: { description: 'ff_circa_b2', aliases: ['circa'] },
  ff_meltdown: { description: 'ff_meltdown' },
  ff_nyx_b2: { description: 'ff_nyx_b2', aliases: ['nyx', 'backway', 'yo', 'gaysex'] },
  ff_palermo: { description: 'ff_palermo' },
  ff_resolve_b2: { description: 'ff_resolve_b2', aliases: ['resolve'] },
  ff_security_b1: { description: 'ff_security_b1', aliases: ['security'] },
  ff_attrition: { description: 'ff_attrition' },
  ff_badlands_beta9: { description: 'ff_badlands_beta9', aliases: ['badlands'] },
  ff_bases: { description: 'ff_bases' },
  ff_catharsis_b4: { description: 'ff_catharsis_b4', aliases: ['cath', 'catharsis'] },
  ff_destroy: { description: 'ff_destroy', aliases: ['something'] },
  ff_genesis: { description: 'ff_genesis' },
  ff_medieval_b11: { description: 'ff_medieval_b11', aliases: ['elmo', 'medi', 'medieval', 'medievil', 'mediveal'] },
  ff_protein: { description: 'ff_protein' },
  ff_reloaded_b1: { description: 'ff_reloaded_b1', aliases: ['reload', 'reloaded'] },
  ff_spiderx: { description: 'ff_spiderx', aliases: ['spider'] },
  ff_waterpolo: { description: 'ff_waterpolo' },
  ff_blitz: { description: 'ff_blitz' },
  ff_charybda: { description: 'ff_charybda' },
  ff_flag4sky_b1: { description: 'ff_flag4sky_b1', aliases: ['flag4sky'] },
  ff_shutdown1: { description: 'ff_shutdown1', aliases: ['sd1'] },
  ff_torch_beta2: { description: 'ff_torch_beta2', aliases: ['torch'] },
  ff_descent_a0: { description: 'ff_descent_a0' },
  ff_ibex_b1: { description: 'ff_ibex_b1', aliases: ['ibex'] },
  ff_cavern_b1: { description: 'ff_cavern_b1', aliases: ['cavern'] },
  ff_trench_b4: { description: 'ff_trench_b4', aliases: ['trench.ff_trench.trench_b4'] },
  ff_waldo_b1: { description: 'ff_waldo_b1', aliases: ['waldo'] },
  ff_zion_b1: { description: 'ff_zion_b1', aliases: ['zion'] },
  ff_quark_classic: { description: 'ff_quark_classic', aliases: ['quark'] },
  ff_myth_b2: { description: 'ff_myth_b2', aliases: ['myth'] },
  ff_destroy_xmas_a3: { description: 'ff_destroy_xmas_a3', aliases: ['destroy_xmas', 'robot_santa'] },
  ff_duality: { description: 'ff_duality', aliases: ['mystique'] },
  ff_mystique_a0: { description: 'ff_mystique_a0' },
  ff_sunnyramps_b1: { description: 'ff_sunnyramps_b1', aliases: ['sunnyramps'] },
  ff_mystique_a4: { description: 'ff_mystique_a4' },
  ff_warmonch: { description: 'ff_warmonch', aliases: ['warmonch'] },
  ff_2bases: { description: 'ff_2bases', aliases: ['2bases'] },
  ff_volleyball: { description: 'ff_volleyball', aliases: ['volleyball'] },
  ff_dm_squeek: { description: 'ff_dm_squeek', aliases: ['squeek'] },
  ff_jeepball_b2: { description: 'ff_jeepball_b2', aliases: ['jeepball'] },
  ff_mulch_dm_b2: { description: 'ff_mulch_dm_b2', aliases: ['mulch_dm', 'mulchdm', 'mulch', 'goose'] },
  ff_ass_dm: { description: 'ff_ass_dm', aliases: ['ass', 'ass_dm', 'ff_ass_dm'] },
  ff_phantom_r: { description: 'ff_phantom_r', aliases: ['phantom'] },
  ff_oblivion_b5: { description: 'ff_oblivion_b5', aliases: ['oblivion'] },
  ff_stowaway2: { description: 'ff_stowaway2', aliases: ['stow2', 'stowaway2'] },
  ff_waterpolo_2006: { description: 'ff_waterpolo_2006', aliases: ['ff_waterpolo_2006'] },
  ff_talos_warehouse: { description: 'ff_talos_warehouse', aliases: ['ff_talos_warehouse', 'talos', 'talos_warehouse', 'warehouse'] },
  ff_fuxbox: { description: 'ff_fuxbox' },
  ff_r123: { description: 'ff_r123' },
  ff_rock2_qnd_b8: { description: 'ff_rock2_qnd_b8', aliases: ['rock2'] },
  ff_phantom_pu: { description: 'ff_phantom_pu', aliases: ['phantom_pu'] },
  ff_dong: { description: 'ff_dong' },
  ff_2fort: { description: 'ff_2fort', aliases: ['2fort', 'mac2fort'] },
  ff_propinquity_b4: { description: 'ff_propinquity_b4', aliases: ['prop', 'propinquity', 'porp', 'grim', 'grimmeltdown', 'meltdown'] },
  ff_boketto_b1: { description: 'ff_boketto_b1', aliases: ['boketto'] },
  ff_hydro_b1: { description: 'ff_hydro_b1', aliases: ['hydro'] },
};

export function getMaps() {
  return maps;
}

export function rockTheVote() {
  console.log('voting has started');
  console.log('nominated:', nominated);
}

export function nominate(map, player) {
  if (nominated.length < max_nominations)
  {
    if (Object.keys(maps).includes(map)) {
      nominated.push({map: map, nominator: player});
    }
    else {
      const aliased = Object.keys(maps).filter((m) => {
        return maps[m].aliases.includes(map);
      });

      if (aliased.length === 1)
        nominated.push({map: aliased.pop(), nominator: player});
      else
        throw "Cant find a map by that name, sorry";
    }
  }
}

// Function to fetch shuffled options for select menu
export function getShuffledOptions(choices) {

  const options = [];

  for (let choice of choices) {
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
