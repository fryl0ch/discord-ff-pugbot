import Module from "node:module";
const require = Module.createRequire(import.meta.url);
const known_maps = require('./known-maps.json');

const captain_modes = {
    shuffle: { description: 'teams are assigned randomly' },
    shuffle_capts: { description: 'two captains are randomly chosen, who then pick their teams' },
    admin_pick_capts: { description: 'pug admin chooses 2 captains, who then pick their teams' },
    admin_rand_capts: { description: 'pug admin provides a list of players for consideration; bot then picks two randomly from the given options' },
    // skill_capts: { description: 'the two players with the highest ELO are chosen as captains, and they then pick the teams'},
    // skill_shuffle: { description: 'bot attempts to pick teams with similar average ELOs'}
  };

class PickupGame {
  admin;
  admin_discord_id;

  max_nominations = 3;
  vote_duration = 30; // in seconds
  nominated = [];

  map_mode = 'vote';

  team_sizes = {
      ones: { description: '1v1', pool_size: 2 }, 
      twos: { description: '2v2', pool_size: 4 },
      threes: { description: '3v3', pool_size: 6 },
      fours: { description: '4v4', pool_size: 8 },
      fives: { description: '5v5', pool_size: 10 },
  };

  players = 8;

  captains_mode = captain_modes['shuffle_capts'];

  started = false;

  full = false;

  pool = {
    red: [], // DEFENSE
    blue: [], // OFFENSE
    pool: [] // player not picked yet, or pug not started yet and pug still filling
  };

  add(player) {
    if (!this.started)
      return 'there is no pickup started';
    else
    {
      if (!this.pool.pool.includes(player))
      {
        this.pool.pool.push(player)

        let addMsg = `${player} has joined the pickup! ${this.pool.pool.length}/${this.players}`;
        if (this.isFull())
        {
          addMsg += "\n Pickup is full!"
          this.full = true;
        }

        return addMsg;
      }
      else
        return `${player} is already in the pool!`
    }
  }

  teams() {
    if (!this.started)
      return 'there is no pickup started';
    else
      return this.pool;
  }

  start(starter) {
    this.admin = starter;
    this.started = true;
    console.log('pickup started by ' + starter.displayName);
  }

  isFull() {
    if (this.pool.pool.length === this.team_size)
      return true;
    else
      return false;
  }

  end() {
    if (!this.started)
      return 'there is no pickup started';

    this.started = false;
    this.full = false;
    
    this.nominated = [];
    this.pool = {
      red: [], // DEFENSE
      blue: [], // OFFENSE
      pool: [] // player not picked yet, or pug not started yet and pug still filling
    };
    this.players = 8;
    console.log('pickup ended');
    return 'pickup ended';
  }

  remove(player) {
    if (this.started === true)
    {
      if (this.pool.pool.includes(player))
      {
        this.pool.pool = this.pool.pool.filter((p) => {
          if (p === player)
            return false;
          else
            return true;
        });
        return `${player} has left the pickup (${this.pool.pool.length}/${this.players})`
      }
      else
        return `${player} isn't even added!`;
    }
    else
      return `there's no pickup running yet! /pickup to start one.`
  };

  rockTheVote() {
    //TBI
  }

  setMode(mode) {
    let modes = ['vote', 'random'];
    if (modes.includes(mode))
    {
      this.map_mode = mode;
      return `pickup map mode set to ${mode}`;
    }
    else
      return `unknown mode: ${mode}`;
  }

  nominate(nomination, player) {
    let map = nomination.toLowerCase();
    if (this.started === true)
    {
      if (this.pool.pool.includes(player))
      {
        if (this.nominated.length < this.max_nominations)
        {
          if (Object.keys(known_maps).includes(map)) {
            this.nominated.push({map: map, nominator: player});
            return `${player} has nominated '${nomination}'`;
          }
          else {
            const aliased = Object.keys(known_maps).filter((m) => {
              if (known_maps[m].aliases)
                if (known_maps[m].aliases.includes(map))
                  return true;
                else
                  return false;
              else
                return false;
            });

            if (aliased.length === 1)
            {
              let actual_map = aliased.pop();
              this.nominated.push({map:actual_map , nominator: player});
              return `${player} has nominated '${map}' (${actual_map})`;
            }
            else
              return "Cant find a map by that name, sorry";
          }
        }
      }
      else
        return "you have to be !added to !nominate";
    }
    else
      return "can't !nominate with no pickup started. !pickup to start one";  
  }
};

export var pickup = new PickupGame();
