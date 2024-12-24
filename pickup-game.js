import Module from "node:module";
const require = Module.createRequire(import.meta.url);
const known_maps = require('./known-maps.json');

class PickupGame {
  max_nominations = 3;
  vote_duration = 30; // in seconds
  nominated = [];

  team_sizes = {
      ones: { description: '1v1', pool: 2 }, 
      twos: { description: '2v2', pool: 4 },
      threes: { description: '3v3', pool: 6 },
      fours: { description: '4v4', pool: 8 },
      fives: { description: '5v5', pool: 10 },
  };

  team_size = 8;

  captain_modes = {
    shuffle: { description: 'teams are assigned randomly' },
    shuffle_capts: { description: 'two captains are randomly chosen, who then pick their teams' },
    admin_pick: { description: 'pug admin chooses 2 captains, who then choose their teams' },
    admin_rand_capts: { description: 'pug admin provides a list of players for consideration; bot then picks two randomly from the given options' },
    // skill_capts: { description: 'the two players with the highest ELO are chosen as captains, and they then pick the teams'},
    // skill_shuffle: { description: 'bot attempts to pick teams with similar average ELOs'}
  };

  started = false;

  pool = {
    red: [], // DEFENSE
    blue: [], // OFFENSE
    pool: [] // player not picked yet, or pug not started yet and pug still filling
  };

  add(player) {
    if (!this.pool.pool.includes(player))
    {
      this.pool.pool.push(player)
      return `${player} has joined the pickup! ${this.pool.pool.length}/${this.team_size}`;
    }
    else
      return `${player} is already in the pool!`
  }

  teams() {
    if (!this.started)
      return 'there is no pickup started';
    else
      return this.pool;
  }

  start() {
    this.started = true;
    console.log('pickup started');
  }

  isFull() {
    if (this.pool.pool.length === this.team_size)
      return true;
    else
      return false;
  }

  end() {
    this.started = false;
    this.nominated = [];
    this.pool = {
      red: [], // DEFENSE
      blue: [], // OFFENSE
      pool: [] // player not picked yet, or pug not started yet and pug still filling
    };
    this.team_size = 8;
    console.log('pickup ended');
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
        return `${player} has left the building`
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

  nominate(map, player) {
    if (this.nominated.length < this.max_nominations)
    {
      if (Object.keys(known_maps).includes(map)) {
        this.nominated.push({map: map, nominator: player});
      }
      else {
        const aliased = Object.keys(known_maps).filter((m) => {
          return known_maps[m].aliases.includes(map);
        });

        if (aliased.length === 1)
          this.nominated.push({map: aliased.pop(), nominator: player});
        else
          throw "Cant find a map by that name, sorry";
      }
    }
  }
};

export var pickup = new PickupGame();
